'use strict';

const { Product } = require('../models/product.model');

exports.getHome = async (req, res, next) => {
    const user = req.userData;
    const title = "E-Trading";
    const products = await Product.findAll({
        attributes: ['id', 'name', 'quantity', 'price']
    });
    res.render('home', {
        title,
        user,
        products: products
    });
};