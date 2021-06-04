'use strict';

const { sequelize } = require("../config/db-connection.config");
const { Op } = require('sequelize');
const { User } = require('../models/user.model');
const { Wallet } = require('../models/wallet.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require('../models/order.model');
const { invoiceGenerator } = require("../helpers/invoice.helper");

exports.addToCart = async (req, res, next) => {
    const { userData } = req;
    const userId = userData.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        await sequelize.query('CALL add_to_cart( :userId, :productId, :quantity)', {
            replacements: { userId, productId, quantity },
            logging: false
        });
        return res.redirect('/home');
        // return res.status(200).send("SuccessFull!");
    } catch (e) {
        console.log(e);
        return res.status(500).send("Something went wrong!");
    }
};

exports.updateCart = async (req, res, next) => {
    const { userData } = req;
    const userId = userData.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    try {
        await sequelize.query('CALL update_cart( :userId, :productId, :quantity)', {
            replacements: { userId, productId, quantity },
            logging: false
        });
        return res.redirect('/user/mycart');
    } catch(e) {
        console.log(e);
        return res.send(500).send("Something went wrong!");
    }
};

exports.checkOut = async (req, res, next) => {
    const { userData } = req;
    const userId = userData.id;
    try {
        const result = await sequelize.transaction(async (checkOut) => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id: userId,
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
                }
            }, {
                transaction: checkOut
            });
            await Cart.destroy({
                logging: false,
                where: {
                    userId: user.id
                }
            }, {
                transaction: checkOut
            });
            return await order;
        });
        return res.redirect('/cart/checkout/'+result.id+'/status');
    } catch (e) {
        return res.status(500).send(e.message);
    }
};

exports.getOrderStatus = async (req, res, next) => {
    const title = "Order Status";
    const { id: userId } = req.userData;
    const { orderId } = req.params;
    try {
        const user = await User.findOne({
            logging: false,
            attributes: [ 'id', 'userName', 'email' ],
            where: {
                id: userId,
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
        return res.status(200).render('orderstatus', { user, title });
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
                }
            }, { transaction: payTransaction });
            const coupon = await Coupon.findOne({
                logging: false,
                where: {
                    userId,
                    code: code??undefined,
                    status: "unused",
                    notAfter: {
                        [Op.gte]: new Date()
                    }
                }
            }, { transaction: payTransaction });
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
                }
            }, { transaction: payTransaction });
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
                }
            }, { transaction: payTransaction });
            if (!failedFlag) {
                for (const detail of order.orderdetails) {
                    detail.product.quantity -= detail.quantity;
                    await detail.product.save({ transaction: payTransaction });
                }
                if (coupon) {
                    coupon.status = 'used';
                    await coupon.save({ transaction: payTransaction });
                }
                user.wallet.amount -= amount;
                await user.wallet.save({ transaction: payTransaction });
                next();
            }
            return await updateOrder;
            
        });
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
                }
            }, { transaction: retryTransaction });
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
                }
            }, { transaction: retryTransaction });
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
                }
            }, { transaction: retryTransaction });
            return await retryOrderResult;
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
                }
            }, { transaction: cancelTransaction });
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
                }
            }, { transaction: cancelTransaction });
            const cancelOrderResult = await Order.update({
                status: 'failed',
                remark: 'Order canceled!'
            }, {
                logging: false,
                where: {
                    userId,
                    id: orderId
                }
            }, { transaction: cancelTransaction });
            return await cancelOrderResult;
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
        await invoiceGenerator(order);
    } catch(e) {
        console.log(e);
    }
};