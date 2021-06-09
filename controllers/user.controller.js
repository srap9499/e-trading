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
            attributes: ["id", "userName", "email"],
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
            attributes: ["id", "userName", "email"],
            where: {
                email: userData.email
            }
        });
        const data = await Coupon.findAndCountAll({
            logging: false,
            limit,
            offset,
            attributes: ["name", "code", "type", "value", "notAfter"],
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

exports.getUserData = async (req, res, next) => {
    const { id } = req.userData;
    try {
        const user = await User.findOne({
            logging: false,
            attributes: ['id', 'userName', 'email'],
            where: {
                id
            }
        });
        return user
            ? res.status(200).send({
                user,
                message: {
                    type: "success",
                    body: "User data found successfully!"
                }
            })
            : res.status(404).send({
                user,
                message: {
                    type: "error",
                    body: "No user data found!"
                }
            });
    } catch (error) {
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
    }
};

// @desc Order History Page
// @route GET /user/orders
exports.getOrderHistoryPage = async (req, res, next) => {
    const { id } = req.userData;
    const title = "Order History";
    try {
        const user = await User.findOne({
            logging: false,
            attributes: ['id', 'userName', 'email'],
            where: {
                id
            }
        });
        return res.status(200).render('orderhistory', {
            user,
            message: {
                type: "success",
                body: "User data found successfully!"
            },
            title
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
    }
};

// @desc Order History Data
// @route GET /user/orders/history
exports.getOrderHistoryData = async (req, res, next) => {
    try {
        const { id } = req.userData;
        const { status, sortBy, orderBy, page, size } = req.query;
        const order = sortBy ? [ [sortBy, orderBy] ] : undefined;
        const where = status ? { status, userId: id } : { userId: id };
        const { limit, offset } = getOrderHistoryPagination({ page, size });
        const data = await Order.findAndCountAll({
            logging: false,
            limit,
            offset,
            order,
            where,
            include: {
                model: OrderDetail,
                attributes: [ 'quantity', 'total' ],
                order: [ 'id', 'ASC'],
                include: {
                    model: Product,
                    attributes: ['id', 'name', 'price']
                }
            }
        });
        let responseData = getOrderHistoryPaginationData({ data, page, limit });
        responseData.message = {
            type: "success",
            body: "Order history fetched successfully!"
        };
        return res.status(200).send(responseData);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong"
            }
        });
    }
};

// @desc User's Wallet Page
// @route GET /user/wallet
exports.getWalletPage = async (req, res, next) => {
    const { id } = req.userData;
    const title = "My Wallet";
    try {
        const user = await User.findOne({
            logging: false,
            attributes: ['id', 'userName', 'email'],
            where: {
                id
            }
        });
        return res.status(200).render('wallet', { user, title });
    } catch (e) {
        console.log(e);
    }
};

// @desc fetch wallet amount
// @route GET /user/wallet/amount
exports.getWalletAmount = async (req, res, next) => {
    const { id: userId } = req.userData;
    try {
        const wallet = await Wallet.findOne({
            attributes: ['amount'],
            where: {
                userId
            }
        });
        return res.status(200).send({ wallet });
    } catch (e) {
        console.log(e);
        return res.status(500).send("Something went wrong");
    }
};

// @desc Add amount to wallet
// @route POST /user/wallet/addmount
exports.addAmount = async (req, res, next) => {
    console.log("I am working here");
    const { id: userId } = req.userData;
    const { amount } = req.body;
    try {
        const wallet = await sequelize.transaction(async addAmountTransaction => {
            const wallet = await Wallet.findOne({
                attributes: ['id', 'amount'],
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