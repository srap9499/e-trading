'use strict';

const { Cart } = require("../models/cart.model");
const { User } = require("../models/user.model");
const { Product } = require('../models/product.model');
const { getCartPagination, getCartPaginationData } = require("../helpers/pagination.helper");
const { Brand } = require("../models/brand.model");
const { Category, Subcategory } = require("../models/categories.model");


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