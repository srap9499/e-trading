'use strict';

const {
    saltValue,
    userStatus,
    roles,
} = require('../config/main.config');

const {
    SUCCESS_MESSAGES: {
        ADD_SUB_ADMIN_SUCCESS,
        DELETE_SUB_ADMIN_SUCCESS,
        RESTORE_SUB_ADMIN_SUCCESS,
        DELETE_BRAND_SUCCESS,
        RESTORE_BRAND_SUCCESS,
        ADD_BRAND_SUCCESS,
        DELETE_PRODUCT_SUCCESS,
        DATA_FETCH_SUCCESS,
        PRODUCTS_FETCH_SUCCESS,
    },
    ERROR_MESSAGES: {
        DEFAULT_ERROR
    },
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA
    },
    VIEW_PATH: {
        ADMIN_VIEWS_PATH
    },
    ADMIN_VIEWS: {
        DASHBOARD_VIEW
    },
    VIEW_TITLES: {
        DEFAULT_TITLE
    }
} = require('../constants/main.constant');

const { hashSync } = require("bcryptjs");
const { UserRole } = require("../models/role.model");
const { User } = require("../models/user.model");
const { Brand } = require('../models/brand.model');
const { Product } = require('../models/product.model');
const { sequelize } = require('../config/db-connection.config');
const { responseObj } = require('../helpers/response.helper');
const { pagination, paginationMetaData } = require('../helpers/pagination.helper');
const { InternalServerError } = require('http-errors');
const { Op } = require('sequelize');


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
 * @description API interface to render admin views on get method
 * @param {String} view 
 * @param {String} title 
 * @returns {Response} View
 */
exports.renderView = (view = DASHBOARD_VIEW, title = DEFAULT_TITLE) => {
    view = ADMIN_VIEWS_PATH + view;
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
 * @description API interface to add Sub Admin
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method POST
 * @returns {Response} JSON
 */
exports.addSubAdmin = async (req, res, next) => {
    const { userName, email, password } = req.body;
    try {
        await sequelize.transaction(async addTransaction => {
            const hashedPassword = hashSync(password, saltValue);
            const subAdminData = {
                userName,
                email,
                password: hashedPassword,
                status: userStatus.Active,
                userroleId: roles.SubAdmin
            };
            await User.create(subAdminData, {
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_SUB_ADMIN_SUCCESS)
        );
    } catch (error) {
        console.log("API catch", error.name);
        next(error);
    }
}

/**
 * @description API interface to fetch all Sub Admins with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.getSubAdmins = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const subadmins = await User.findAndCountAll({
            logging: false,
            attributes: ['id', 'userName', 'email', 'userroleId'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            where: {
                userroleId: roles.SubAdmin
            },
            distinct: true
        });
        const data = paginationMetaData(subadmins, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch deleted Sub Admins with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
 exports.getSubAdminsTrash = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const subadmins = await User.findAndCountAll({
            logging: false,
            attributes: ['id', 'userName', 'email', 'userroleId'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            where: {
                userroleId: roles.SubAdmin,
                deletedAt: {
                    [Op.ne]: null
                }
            },
            distinct: true,
            paranoid: false
        });
        const data = paginationMetaData(subadmins, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to soft delete Sub admin
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.destroySubAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await User.destroy({
            logging: false,
            where: {
                id: parseInt(id),
                userroleId: roles.SubAdmin
            }
        });
        return res.status(200).send(
            responseObj(true, DELETE_SUB_ADMIN_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to restore deleted Sub admin
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
 exports.restoreSubAdmin = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await User.restore({
            logging: false,
            where: {
                id: parseInt(id),
                userroleId: roles.SubAdmin
            }
        });
        return res.status(200).send(
            responseObj(true, RESTORE_SUB_ADMIN_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch all Brands with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
 exports.getBrands = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const brands = await Brand.findAndCountAll({
            logging: false,
            attributes: ['id', 'name'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            distinct: true
        });
        const data = paginationMetaData(brands, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch deleted Brands with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
 exports.getBrandsTrash = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const brands = await Brand.findAndCountAll({
            logging: false,
            attributes: ['id', 'name'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            where: {
                deletedAt: {
                    [Op.ne]: null
                }
            },
            distinct: true,
            paranoid: false
        });
        const data = paginationMetaData(brands, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to soft delete Brand
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.destroyBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await Brand.destroy({
            logging: false,
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).send(
            responseObj(true, DELETE_BRAND_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to restore deleted Sub admin
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
 exports.restoreBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await Brand.restore({
            logging: false,
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).send(
            responseObj(true, RESTORE_BRAND_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to add Brand
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method POST
 * @returns {Response} JSON
 */
exports.addBrand = async (req, res, next) => {
    const { name } = req.body;
    try {
        await sequelize.transaction(async addTransaction => {
            await Brand.create({
                name
            }, {
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_BRAND_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch all Products with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
 exports.getProducts = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const products = await Product.findAndCountAll({
            logging: false,
            attributes: ['id', 'name', 'quantity', 'price'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            distinct: true
        });
        const data = paginationMetaData(products, page, limit);
        return res.status(200).send(
            responseObj(true, PRODUCTS_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to soft delete Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
 exports.destroyProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await Product.destroy({
            logging: false,
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).send(
            responseObj(true, DELETE_PRODUCT_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};
