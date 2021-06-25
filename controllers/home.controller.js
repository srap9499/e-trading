'use strict';

const {
    SUCCESS_MESSAGES: {
        PRODUCTS_FETCH_SUCCESS,
        UPDATE_PROFILE_SUCCESS,
        ADD_AMOUNT_SUCCESS,
        ORDER_HISTORY_FETCH_SUCCESS
    
    },
    ERROR_MESSAGES: {
        WRONG_OTP,
        EMAIL_ALREADY_EXISTS
    },
    VIEW_PATH: {
        USER_VIEWS_PATH
    },
    USER_VIEWS: {
        HOME_VIEW,
        COUPON_VIEW,
    },
    VIEW_TITLES: {
        DEFAULT_TITLE,
        USER_VIEW_TITLES: {
            COUPON_TITLE,
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA
    }
} = require('../constants/main.constant');

const { 
    pagination,
    paginationMetaData
} = require('../helpers/pagination.helper');
const { UserRole } = require('../models/role.model');
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Brand } = require('../models/brand.model');
const { Category, Subcategory } = require('../models/categories.model');
const { responseObj } = require('../helpers/response.helper');


const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        logging: false,
        attributes: ['id', 'userName', 'email', 'userroleId'],
        include: {
            model: UserRole,
            attributes: ['id', 'role']
        }
    });
    return user;
}

/**
 * @description API interface to render user views on get method
 * @param {String} view 
 * @param {String} title 
 * @returns {Response} View
 */
exports.renderView = (view = HOME_VIEW, title = DEFAULT_TITLE) => {
    view = USER_VIEWS_PATH + view;
    return async (req, res, next) => {
        const { id } = req[REQUEST_USERDATA];
        try {
            const user = await getUserById(id);
            return res.status(200).render(view, {
                user,
                title
            });
        } catch (error) {
            next(error);
        }
    };
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
        const { limit, offset } = pagination({ page, size });
        const products = await Product.findAndCountAll({
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
        const data = paginationMetaData(products, page, limit);
        return res.status(200).send(
            responseObj(true, PRODUCTS_FETCH_SUCCESS, data)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};