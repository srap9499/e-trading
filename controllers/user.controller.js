'use strict';

const { 
    getCartPagination, 
    getCartPaginationData, 
    getCouponPagination, 
    getCouponPaginationData,
    getOrderHistoryPagination,
    getOrderHistoryPaginationData
} = require("../helpers/pagination.helper");

const { Op } = require('sequelize');
const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { Wallet } = require('../models/wallet.model');
const { Product } = require('../models/product.model');
const { Brand } = require("../models/brand.model");
const { Category, Subcategory } = require("../models/categories.model");
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require("../models/order.model");
const { sequelize } = require("../config/db-connection.config");


exports.getMyCart = async (req, res, next) => {
    const { userData } = req;
    const title = "My Cart";
    const { page, size } = req.query;
    try {
        const { limit, offset } = getCartPagination({ page, size });
        const user = await User.findOne({
            logging: false,
            attributes: [ "id", "userName", "email" ],
            where: {
                email: userData.email
            },
        });
        const data = await Cart.findAndCountAll({
            logging: false,
            attributes: ["quantity"],
            limit,
            offset,
            where: { userId: user.id },
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
        let renderData = getCartPaginationData({ data, page, limit });
        renderData.title = title;
        renderData.user = user;
        // return res.send(renderData);
        return res.status(200).render('cart', renderData);
    } catch (e) {
        next(e);
        // next({error: e, view: "cart", title});
    }
};

exports.getMyCoupons = async (req, res, next) => {
    const { userData } = req;
    const title = "My Coupons";
    const { page, size } = req.query;
    try {
        const { limit, offset } = getCouponPagination({ page, size });
        const user = await User.findOne({
            logging: false,
            attributes: [ "id", "userName", "email" ],
            where: {
                email: userData.email
            }
        });
        const data = await Coupon.findAndCountAll({
            logging: false,
            limit,
            offset,
            attributes: [ "name", "code", "type", "value", "notAfter" ],
            where: {
                userId: user.id,
                status: "unused",
                notAfter: {
                    [Op.gte]: new Date()
                }
            },
        });
        let renderData = getCouponPaginationData({ data, page, limit });
        renderData.title = title;
        renderData.user = user;
        return res.status(200).render('coupon', renderData);
    } catch (e) {
        console.log(e);
    }
};

exports.getOrderHistory = async (req, res, next) => {
    const { id } = req.userData;
    const title = "Order History";
    const { page, size } = req.query;
    try {
        const { limit, offset } = getOrderHistoryPagination({ page, size });
        const user = await User.findOne({
            logging: false,
            attributes: [ "id", "userName", "email" ],
            where: {
                id
            }
        });
        const data = await Order.findAndCountAll({
            logging: false,
            limit,
            offset,
            order: [
                ['date', 'DESC']
            ],
            where: {
                userId: id
            },
            include: {
                model: OrderDetail,
                attributes: [ 'quantity', 'total' ],
                order: ['id', 'ASC'],
                include: {
                    model: Product,
                    attributes: [ 'id', 'name', 'price' ]
                }
            }
        });
        let renderData = getOrderHistoryPaginationData({ data, page, limit});
        renderData.user = user;
        renderData.title = title;
        return res.status(200).render('orderhistory', renderData);
    } catch (e) {
        console.log(e);
    }
};

exports.getWalletPage = async (req, res, next) => {
    const { id } = req.userData;
    const title = "My Wallet";
    try {
        const user = await User.findOne({
            logging: false,
            attributes: [ 'id', 'userName', 'email' ],
            where: {
                id
            }
        });
        return res.status(200).render('wallet', { user, title });
    } catch(e) {
        console.log(e);
    }
};

exports.getWalletAmount = async (req, res, next) => {
    const { id: userId } = req.userData;
    try {
        const wallet = await Wallet.findOne({
            attributes: [ 'amount' ],
            where: {
                userId
            }
        });
        return res.status(200).send({ wallet });
    } catch(e) {
        console.log(e);
        return res.status(500).send("Something went wrong");
    }
};

exports.addAmount = async (req, res, next) => {
    console.log("I am working here");
    const { id: userId } = req.userData;
    const { amount } = req.body;
    try {
        const wallet = await sequelize.transaction(async addAmountTransaction => {
            const wallet = await Wallet.findOne({
                attributes: [ 'id', 'amount' ],
                where: {
                    userId
                },
                transaction: addAmountTransaction,
            });
            wallet.amount = +(wallet.amount) + +amount;
            await wallet.save({ transaction: addAmountTransaction });
            return await wallet;
        });
        return res.status(200).send({
            message: {
                type: "success",
                body: "Successfully added amount to wallet!"
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