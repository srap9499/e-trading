'use strict';

const { 
    getProductPagination,
    getProductPaginationData
} = require('../helpers/pagination.helper');
const { Product } = require('../models/product.model');

exports.getHome = async (req, res, next) => {
    const user = req.userData;
    const title = "E-Trading";
    const { page, size } = req.query;
    const { limit, offset } = getProductPagination({ page, size });
    const data = await Product.findAndCountAll({
        attributes: ['id', 'name', 'quantity', 'price'],
        limit,
        offset
    });
    let renderData = getProductPaginationData({ data, page, limit });
    renderData.title = title;
    renderData.user = user;
    res.render('home', renderData);
};