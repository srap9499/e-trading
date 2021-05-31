'use strict';

const { sequelize } = require("../config/db-connection.config");
const { User } = require('../models/user.model');
const { Wallet } = require('../models/wallet.model');
const { Cart } = require('../models/cart.model');
const { Product } = require('../models/product.model');
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require('../models/order.model');
const { use } = require("../routes/home.routes");

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
    const user = await User.findOne({
        attributes: ['id', 'userName', 'email'],
        where: {
            id: userData.id,
        }
    });
    const cart = await Cart.findAll({
        where: {
            userId: user.id
        },
        include: {
            model: Product
        }
    });
    let sum = 0;
    
    const detail = await cart.map(i => {
        sum += i.quantity * i.product.price;
        return {
            productId: i.productId,
            quantity: i.quantity,
            total: i.quantity * i.product.price
        }
    });
    
    let data = {
        userId: user.id,
        totalAmount: sum,
        discountedAmount: sum,
        orderdetails: detail
    };
    console.log(data);

    const order = await Order.create(data, {
        include: {
            model: OrderDetail
        }
    });
    await Cart.destroy({
        where: {
            userId: user.id
        }
    });

    return res.send(order);
};