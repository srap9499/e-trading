'use strict';

const { Product } = require('../models/product.model');

// add product
exports.postAddProduct = async (req, res, next) => {
    const { name, quantity, price } = req.body;

    if (!name || !quantity || !price) {
        return res.status(400).send("Please provide all the fields: Name, Quantity & Price!");
    }
    try {
        const productData = {
            name,
            quantity,
            price
        };
        const product = await Product.create(productData);
        return res.status(200).send(product);
    } catch(err) {
        console.log(err);
        return res.status(500).send("Something went wrong!");
    }
};