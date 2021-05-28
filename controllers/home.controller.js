'use strict';

const { 
    getProductPagination,
    getProductPaginationData
} = require('../helpers/pagination.helper');
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Brand } = require('../models/brand.model');
const { Category, Subcategory } = require('../models/categories.model');

exports.getHome = async (req, res, next) => {
    const { userData } = req;
    const title = "E-Trading";
    const { page, size } = req.query;
    const { limit, offset } = getProductPagination({ page, size });
    const user = await User.findOne({
        logging: false,
        attributes: ["id", "userName", "email"],
        where: {
            email: userData.email
        },
    });
    const data = await Product.findAndCountAll({
        logging: false,
        attributes: ['id', 'name', 'quantity', 'price'],
        limit,
        offset,
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
    });
    let renderData = getProductPaginationData({ data, page, limit });
    renderData.title = title;
    renderData.user = user;
    res.render('home', renderData);
};