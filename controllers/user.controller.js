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
const { Product } = require('../models/product.model');
const { Brand } = require("../models/brand.model");
const { Category, Subcategory } = require("../models/categories.model");
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require("../models/order.model");


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