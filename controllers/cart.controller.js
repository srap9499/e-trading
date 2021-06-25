'use strict';

const {
    SUCCESS_MESSAGES: {
        ADD_TO_CART_SUCCESS,
        UPDATE_CART_SUCCESS,
        CART_FETCH_SUCCESS,
    },
    ERROR_MESSAGES: {
        ADD_TO_CART_OUT_OF_STOCK_ERROR,
        DEFAULT_ERROR
    },
    VIEW_PATH: {
        USER_VIEWS_PATH,
    },
    USER_VIEWS: {
        ORDER_STATUS_VIEW,
    },
    VIEW_TITLES: {
        USER_VIEW_TITLES: {
            ORDER_STATUS_TITLE,
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA
    },
    ORDER_REMARKS: {
        PRODUCT_OUT_OF_STOCK,
        PAYMENT_PENDING,
        INVALID_COUPON,
        INSUFFICIENT_WALLET_AMOUNT,
        ORDER_CANCELED,
        ORDER_PLACED_SUCCESS
    }
} = require('../constants/main.constant');

const { sequelize } = require("../config/db-connection.config");
const { Op } = require('sequelize');
const { User } = require('../models/user.model');
const { Wallet } = require('../models/wallet.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Brand } = require('../models/brand.model');
const { Category, Subcategory } = require('../models/categories.model');
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require('../models/order.model');
const { invoiceGenerator } = require("../helpers/invoice.helper");
const { sendInvoiceMail } = require("../helpers/mail.helper");
const { formatDateTime } = require("../helpers/date.helper");
const { InternalServerError, BadRequest } = require('http-errors');
const { responseObj } = require('../helpers/response.helper');

/**
 * @description API interface to add Products to user's cart
 * @type Function
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Response} JSON
 */
exports.addToCart = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        const product = await Product.findOne({
            logging: false,
            attributes: [ 'quantity' ],
            where: {
                id: productId
            }
        });
        const cart = await Cart.findOne({
            logging: false,
            attributes: [ 'quantity' ],
            where: {
                userId,
                productId
            }
        });
        if (cart && cart.quantity && parseInt(product.quantity) < (parseInt(cart.quantity) + parseInt(quantity))) {
            throw new BadRequest(ADD_TO_CART_OUT_OF_STOCK_ERROR);
        }
        await sequelize.transaction(async addTransaction => {
            await sequelize.query('CALL add_to_cart( :userId, :productId, :quantity)', {
                replacements: { userId, productId, quantity },
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_TO_CART_SUCCESS)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * @description API interface to Get Cart data
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @returns {Response} Cart Products: JSON
 */
 exports.getCartData = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    try {
        const cartdata = await Cart.findAll({
            logging: false,
            attributes: ["quantity"],
            where: { userId },
            include: {
                model: Product,
                attributes: ["id", "name", "quantity", "price"],
                include: [
                    {
                        model: Brand,
                        attributes: ["name"]
                    },
                    {
                        model: Category,
                        attributes: ["category"]
                    },
                    {
                        model: Subcategory,
                        attributes: ["subcategory"]
                    }
                ]
            }
        });
        cartdata.forEach(item => {
            item.dataValues.subTotal = parseInt(item.quantity) * parseFloat(item.product.price);
        });
        return res.status(200).send(
            responseObj(true, CART_FETCH_SUCCESS, cartdata)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * @description API interface to update Products into user's cart
 * @type Function
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Response} JSON
 */
exports.updateCart = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        await sequelize.transaction(async updateTransaction => {
            await sequelize.query('CALL update_cart( :userId, :productId, :quantity)', {
                replacements: { userId, productId, quantity },
                logging: false,
                transaction: updateTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, UPDATE_CART_SUCCESS)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * @description API interface to Proceed for order checkout
 * @param {Request} req 
 * @param {Response} res 
 * @param {import("express").NextFunction} next 
 * @returns {Response} order.id: JSON
 */
exports.checkOut = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    try {
        const result = await sequelize.transaction(async (checkOutTransaction) => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id: userId
                },
                include: {
                    model: Cart,
                    include: {
                        model: Product,
                        attributes: [ 'id', 'quantity', 'price' ]
                    }
                },
                transaction: checkOutTransaction
            });
            let sum = 0;
        
            let outOfStock = false;
            if (!user.carts.length) {
                throw new InternalServerError(DEFAULT_ERROR);
            }
            
            const cartDetail = await user.carts.map(i => {
                if (i.quantity > i.product.quantity) {
                    outOfStock = true;
                }
                sum += i.quantity * i.product.price;
                return {
                    productId: i.productId,
                    quantity: i.quantity,
                    total: i.quantity * i.product.price
                }
            });
            
            let orderData = {
                userId,
                totalAmount: sum,
                discountedAmount: sum,
                orderdetails: cartDetail,
                status: outOfStock ? "failed" : undefined,
                remark: outOfStock ? PRODUCT_OUT_OF_STOCK : PAYMENT_PENDING
            };
        
            const order = await Order.create(orderData, {
                logging: false,
                include: {
                    model: OrderDetail
                },
                transaction: checkOutTransaction
            });
            await Cart.destroy({
                logging: false,
                where: {
                    userId: user.id
                },
                transaction: checkOutTransaction
            });
            return order;
        });
        return res.status(200).send({ id: result.id });
        // res.redirect('/cart/checkout/'+result.id+'/status');
    } catch (error) {
        next(error);
    }
};

exports.getOrderStatus = async (req, res, next) => {
    const title = ORDER_STATUS_TITLE;
    const { id } = req[REQUEST_USERDATA];
    const { orderId } = req.params;
    try {
        const user = await User.findOne({
            logging: false,
            attributes: [ 'id', 'userName', 'email' ],
            where: {
                id
            },
            include: {
                model: Order,
                attributes: [ 'id', 'date', 'totalAmount', 'couponId', 'discountedAmount', 'status', 'remark'],
                limit: 1,
                where: {
                    id: orderId
                },
                include: {
                    model: Coupon,
                    attributes: [ 'name', 'code' ]
                }
            }
        });
        await user.orders.forEach(order => {
            order.dataValues.date = formatDateTime(order.date);
        });
        res.render(USER_VIEWS_PATH + ORDER_STATUS_VIEW, { user, title });
    } catch (e) {
        console.log(e);
    }
};

exports.payment = async (req, res, next) => {
    const {  id: userId } = req[REQUEST_USERDATA];
    const { orderId } = req.params;
    const { code } = req.body;
    try {
        const result = await sequelize.transaction(async payTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id: userId
                },
                include: {
                    model: Wallet,
                    attributes: [ 'id', 'amount' ]
                },
                transaction: payTransaction
            });
            const coupon = await Coupon.findOne({
                logging: false,
                where: {
                    userId,
                    code: code??undefined,
                    status: "unused",
                    notAfter: {
                        [Op.gte]: new Date()
                    }
                },
                transaction: payTransaction
            });
            const order = await Order.findOne({
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                include: {
                    model: OrderDetail,
                    attributes: [ 'quantity' ],
                    include: {
                        model: Product,
                        attributes: [ 'id', 'quantity' ],
                    }
                },
                transaction: payTransaction
            });
            let failedFlag = false;
            let remark = ORDER_PLACED_SUCCESS;
            for (const detail of order.orderdetails) {
                if (detail.quantity > detail.product.quantity) {
                    failedFlag = true;
                    remark = PRODUCT_OUT_OF_STOCK;
                }
            }
            if (!failedFlag && code && !coupon) {
                failedFlag = true;
                remark = INVALID_COUPON;
            }
            let amount = order.discountedAmount;
            if (!failedFlag && coupon) {
                amount = coupon.type === "dynamic" ? ( amount - (amount * coupon.value / 100) ) : (amount - coupon.value);
            }
            if (!failedFlag && (user.wallet.amount - amount) < 0) {
                failedFlag = true;
                remark = INSUFFICIENT_WALLET_AMOUNT;
            }
            const updateOrder = await Order.update({
                discountedAmount: !failedFlag ? amount : undefined,
                couponId: !failedFlag && coupon ? coupon.id : undefined,
                status: !failedFlag ? 'success' : 'failed',
                remark
            }, {
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                transaction: payTransaction
            });
            if (!failedFlag) {
                for (const detail of order.orderdetails) {
                    detail.product.quantity -= detail.quantity;
                    await detail.product.save({ logging: false, transaction: payTransaction });
                }
                if (coupon) {
                    coupon.status = 'used';
                    await coupon.save({ logging: false, transaction: payTransaction });
                }
                user.wallet.amount -= amount;
                await user.wallet.save({ logging: false, transaction: payTransaction });
            }
            return { updateOrder, failedFlag };
            
        });
        if (result.failedFlag === false) {
            await next();
        }
        return res.redirect('/cart/checkout/'+orderId+'/status');
    } catch (e) {
        console.log(e);
    }
};

exports.retryOrder = async (req, res, next) => {
    const {  id: userId } = req[REQUEST_USERDATA];
    const { orderId } = req.params;
    try {
        await sequelize.transaction(async retryTransaction => {
            const order = await Order.findOne({
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                include: {
                    model: OrderDetail,
                    attributes: [ 'quantity' ],
                    include: {
                        model: Product,
                        attributes: [ 'id', 'quantity' ],
                    }
                },
                transaction: retryTransaction
            });
            let failedFlag = false;
            let remark = PAYMENT_PENDING;
            for (const detail of order.orderdetails) {
                if (detail.quantity > detail.product.quantity) {
                    failedFlag = true;
                    remark = PRODUCT_OUT_OF_STOCK;
                }
            }
            const retryOrderResult = await Order.update({
                status: !failedFlag ? 'pending' : 'failed',
                remark
            }, {
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                transaction: retryTransaction
            });
            return retryOrderResult;
        });
        return res.redirect('/cart/checkout/'+orderId+'/status');
    } catch (e) {
        return res.redirect('/cart/checkout/'+orderId+'/status');
    }
};

exports.cancelOrder = async (req, res, next) => {
    const {  id: userId } = req[REQUEST_USERDATA];
    const { orderId } = req.params;
    try {
        await sequelize.transaction(async cancelTransaction => {
            await Order.update({
                status: 'failed',
                remark: ORDER_CANCELED
            }, {
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                transaction: cancelTransaction
            });
        });
        return res.redirect('/cart/checkout/'+orderId+'/status');
    } catch (e) {
        return res.redirect('/cart/checkout/'+orderId+'/status');
    }
};

exports.generateInvoice = async (req, res, next) => {
    const userData = req[REQUEST_USERDATA];
    const { id: userId } = req[REQUEST_USERDATA];
    const { orderId } = req.params;
    try {
        const order = await Order.findOne({
            logging: false,
            where: {
                userId,
                id: orderId
            },
            include: [
                {
                    model: User,
                    attributes: [ 'id', 'userName', 'email' ]
                },
                {
                    model: OrderDetail,
                    attributes: [ 'id', 'quantity', 'total', ],
                    include: {
                        model: Product,
                        attributes: ['id', 'name', 'price']
                    }
                },
                {
                    model: Coupon,
                    attributes: [ 'id', 'name', 'code' ]
                }
            ]
        });
        order.dataValues.date = formatDateTime(order.date);
        await invoiceGenerator(order).then(() => {
            sendInvoiceMail(userData, orderId);
        });
    } catch(error) {
        console.log(error);
    }
};