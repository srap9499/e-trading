'use strict';

const { sequelize } = require("../config/db-connection.config");
const { Op } = require('sequelize');
const { User } = require('../models/user.model');
const { Wallet } = require('../models/wallet.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require('../models/order.model');

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
        if (result.status==="pending") {
            return res.status(200).send(result);
        }
        if (result.status==="failed") {
            return res.redirect('/user/orderhistory');
        }
    } catch (e) {
        return res.status(500).send(e.message);
    }
};