'use strict';

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

/**
 * @description API interface to add Products to user's cart
 * @type Function
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Response} JSON
 */
exports.addToCart = async (req, res, next) => {
    const { id: userId } = req.userData;
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
            return res.status(400).send({
                message: {
                    type: "error",
                    body: "Insufficient stock to add!"
                }
            });
        }
        await sequelize.transaction(async addTransaction => {
            await sequelize.query('CALL add_to_cart( :userId, :productId, :quantity)', {
                replacements: { userId, productId, quantity },
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send({
            message: {
                type: "success",
                body: "Product added to cart!"
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
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
    const { id: userId } = req.userData;
    try {
        const cartItems = await Cart.findAll({
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
        cartItems.forEach(item => {
            item.dataValues.subTotal = parseInt(item.quantity) * parseFloat(item.product.price);
        });
        return res.status(200).send({
            cartItems,
            message: {
                type: "success",
                body: "Cart items fetched Successfully!"
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
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
    const { id: userId } = req.userData;
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
        return res.status(200).send({
            message: {
                type: "success",
                body: "Cart updated successfully!"
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
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
    const { id: userId } = req.userData;
    try {
        const result = await sequelize.transaction(async (checkOut) => {
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
                }
            });
            let sum = 0;
        
            let outOfStock = false;
            if (!user.carts.length) {
                throw new Error('Something went wrong!');
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
                remark: outOfStock ? "Insufficient product quantity!" : undefined
            };
        
            const order = await Order.create(orderData, {
                logging: false,
                include: {
                    model: OrderDetail
                },
                transaction: checkOut
            });
            await Cart.destroy({
                logging: false,
                where: {
                    userId: user.id
                },
                transaction: checkOut
            });
            return order;
        });
        return res.status(200).send({ id: result.id });
        // res.redirect('/cart/checkout/'+result.id+'/status');
    } catch (error) {
        return res.status(500).send({
            message: {
                type: 'error',
                body: error.message
            }
        });
    }
};

exports.getOrderStatus = async (req, res, next) => {
    const title = "Order Status";
    const { id } = req.userData;
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
        res.render('orderstatus', { user, title });
    } catch (e) {
        console.log(e);
    }
};

exports.payment = async (req, res, next) => {
    const {  userData } = req;
    const userId = userData.id;
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
            let remark = 'Order Placed';
            for (const detail of order.orderdetails) {
                if (detail.quantity > detail.product.quantity) {
                    failedFlag = true;
                    remark = "Insufficient product quantity!";
                }
            }
            if (!failedFlag && code && !coupon) {
                failedFlag = true;
                remark = "Invalid coupon code!";
            }
            let amount = order.discountedAmount;
            if (!failedFlag && coupon) {
                amount = coupon.type === "dynamic" ? ( amount - (amount * coupon.value / 100) ) : (amount - coupon.value);
            }
            if (!failedFlag && (user.wallet.amount - amount) < 0) {
                failedFlag = true;
                remark = "Insufficient wallet amount!";
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
    const {  userData } = req;
    const userId = userData.id;
    const { orderId } = req.params;
    try {
        const result = await sequelize.transaction(async retryTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id: userId
                },
                transaction: retryTransaction
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
                transaction: retryTransaction
            });
            let failedFlag = false;
            let remark = 'Payment pending';
            for (const detail of order.orderdetails) {
                if (detail.quantity > detail.product.quantity) {
                    failedFlag = true;
                    remark = "Insufficient product quantity!";
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
    const {  userData } = req;
    const userId = userData.id;
    const { orderId } = req.params;
    try {
        const result = await sequelize.transaction(async cancelTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id: userId
                },
                transaction: cancelTransaction
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
                transaction: cancelTransaction
            });
            const cancelOrderResult = await Order.update({
                status: 'failed',
                remark: 'Order canceled!'
            }, {
                logging: false,
                where: {
                    userId,
                    id: orderId
                },
                transaction: cancelTransaction
            });
            return cancelOrderResult;
        });
        return res.redirect('/cart/checkout/'+orderId+'/status');
    } catch (e) {
        return res.redirect('/cart/checkout/'+orderId+'/status');
    }
};

exports.generateInvoice = async (req, res, next) => {
    const {  userData } = req;
    const userId = userData.id;
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
    } catch(e) {
        console.log(e);
    }
};