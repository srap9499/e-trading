'use strict';

const { 
    getProductPagination,
    getProductPaginationData
} = require('../helpers/pagination.helper');
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Brand } = require('../models/brand.model');
const { Category, Subcategory } = require('../models/categories.model');

/**
 * @description API interface to get home page.
 * @type Function
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Response} EJS
 */
exports.getHomePage = async (req, res, next) => {
    const { id } = req.userData;
    const title = "E-Trading";
    try {
        const user = await User.findOne({
            logging: false,
            attributes: ["id", "userName", "email"],
            where: {
                id
            },
        });
        return res.status(200).render('home', { user, title });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
    }
};

/**
 * @description API interface to get Products
 * @type Function
 * @param {Request} req 
 * @param {Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Response} JSON: Products
 */
exports.getProductsData = async (req, res, next) => {
    try {
        const { page, size } = req.query;
        const { limit, offset } = getProductPagination({ page, size });
        const data = await Product.findAndCountAll({
            logging: false,
            attributes: ['id', 'name', 'quantity', 'price', 'imagePath' ],
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
        let responseData = getProductPaginationData({ data, page, limit });
        responseData.message = {
            type: "success",
            body: "Products fetched successfully!"
        };
        return res.status(200).send(responseData);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: {
                type: "error",
                body: "Something went wrong!"
            }
        });
    }
};