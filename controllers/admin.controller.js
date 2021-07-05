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
        EDIT_BRAND_SUCCESS,
        DELETE_PRODUCT_SUCCESS,
        RESTORE_PRODUCT_SUCCESS,
        ADD_PRODUCT_SUCCESS,
        DELETE_CATEGORY_SUCCESS,
        DELETE_SUB_CATEGORY_SUCCESS,
        RESTORE_CATEGORY_SUCCESS,
        RESTORE_SUB_CATEGORY_SUCCESS,
        ADD_CATEGORY_SUCCESS,
        ADD_SUB_CATEGORY_SUCCESS,
        EDIT_CATEGORY_SUCCESS,
        EDIT_SUB_CATEGORY_SUCCESS,
        DATA_FETCH_SUCCESS,
        PRODUCTS_FETCH_SUCCESS,
    },
    ERROR_MESSAGES: {
        EDIT_BRAND_CANNOT_BE_SAME_ERROR,
        EDIT_CATEGORY_CANNOT_BE_SAME_ERROR,
        EDIT_SUB_CATEGORY_CANNOT_BE_SAME_ERROR,
        DEFAULT_ERROR
    },
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA,
        REQUEST_FILENAME,
        REQUEST_PARAMS
    },
    PRODUCTS_IMAGE_PATH,
    VIEW_PATH: {
        ADMIN_VIEWS_PATH
    },
    ADMIN_VIEWS: {
        DASHBOARD_VIEW
    },
    VIEW_TITLES: {
        DEFAULT_TITLE
    },
    DEFAULTS: {
        DEFAULT_SUBCATEGORY,
        DEFAULT_PRODUCT_IMAGE_NAME
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
const { InternalServerError, BadRequest } = require('http-errors');
const { Op } = require('sequelize');
const { Category, Subcategory } = require('../models/categories.model');


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
 * @description API interface to restore deleted Brand
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
 * @description API interface to get Brand By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - brand
 */
exports.getBrandById = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_PARAMS];
        const brand = await sequelize.transaction(async getTransaction => {
            const brand = await Brand.findByPk(id, {
                logging: false,
                attributes: ['id', 'name'],
                distinct: true,
                transaction: getTransaction
            });
            return brand;
        });
        if (!brand) {
            throw new BadRequest(DEFAULT_ERROR);
        }
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, brand)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to Edit Brand By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - message
 */
exports.editBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await sequelize.transaction(async editTransaction => {
            const brand = await Brand.update({
                name
            }, {
                logging: false,
                where: {
                    id
                },
                transaction: editTransaction
            });
            if (brand[0] === 0) {
                throw new BadRequest(EDIT_BRAND_CANNOT_BE_SAME_ERROR);
            }
        });
        return res.status(200).send(
            responseObj(true, EDIT_BRAND_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch Categories with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.getCategories = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({page, size});
        const categories = await Category.findAndCountAll({
            logging: false,
            attributes: ['id', 'category'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            include: {
                model: Subcategory,
                attributes: ['id', 'subcategory']
            },
            distinct: true
        });
        const data = paginationMetaData(categories, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to soft delete Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.destroyCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Category.destroy({
            logging: false,
            where: {
                id
            }
        });
        return res.status(200).send(
            responseObj(true, DELETE_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to soft delete Sub Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.destroySubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Subcategory.destroy({
            logging: false,
            where: {
                id
            }
        });
        return res.status(200).send(
            responseObj(true, DELETE_SUB_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch Categories Trash with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.getCategoriesTrash = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({page, size});
        const categories = await Category.findAndCountAll({
            logging: false,
            attributes: ['id', 'category'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            where: {
                deletedAt: {
                    [Op.ne]: null
                }
            },
            include: {
                model: Subcategory,
                attributes: ['id', 'subcategory']
            },
            distinct: true,
            paranoid: false
        });
        const data = paginationMetaData(categories, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to fetch Categories Trash with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
exports.getSubCategoriesTrash = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({page, size});
        const categories = await Category.findAndCountAll({
            logging: false,
            attributes: ['id', 'category'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            include: {
                model: Subcategory,
                attributes: ['id', 'subcategory'],
                where: {
                    deletedAt: {
                        [Op.ne]: null
                    }
                },
                paranoid: false
            },
            distinct: true,
        });
        const data = paginationMetaData(categories, page, limit);
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, data)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to restore deleted Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.restoreCategory = async (req, res, next) => {
    try {
        const  { id } = req.params;
        await Category.restore({
            logging: false,
            where: {
                id
            }
        });
        return res.status(200).send(
            responseObj(true, RESTORE_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to restore deleted Sub Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.restoreSubCategory = async (req, res, next) => {
    try {
        const  { id } = req.params;
        await Subcategory.restore({
            logging: false,
            where: {
                id
            }
        });
        return res.status(200).send(
            responseObj(true, RESTORE_SUB_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to Add Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.addCategory = async (req, res, next) => {
    try {
        const { category } = req.body;
        await sequelize.transaction(async addTransaction => {
            await Category.create({
                category,
                subcategories: [
                    {subcategory: DEFAULT_SUBCATEGORY}
                ]
            }, {
                logging: false,
                include: {
                    model: Subcategory
                },
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to get Category By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - category
 */
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_PARAMS];
        const category = await sequelize.transaction(async getTransaction => {
            const category = await Category.findByPk(id, {
                logging: false,
                attributes: ['id', 'category'],
                distinct: true,
                transaction: getTransaction
            });
            return category;
        });
        if (!category) {
            throw new BadRequest(DEFAULT_ERROR);
        }
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, category)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to Edit Category By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - message
 */
exports.editCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { category } = req.body;
        await sequelize.transaction(async editTransaction => {
            const _category = await Category.update({
                category,
            }, {
                logging: false,
                where: {
                    id
                },
                transaction: editTransaction
            });
            if (_category[0] === 0) {
                throw new BadRequest(EDIT_CATEGORY_CANNOT_BE_SAME_ERROR);
            }
        });
        return res.status(200).send(
            responseObj(true, EDIT_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to previous selected Category for add Sub Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Previous Category
 */
exports.getSubcategory_previousSelectedCategory = async (req, res, next) => {
    try {
        const previous_category = await sequelize.transaction(async getTransaction => {
            const subcategory = await Subcategory.findOne({
                logging: false,
                attributes: [ 'categoryId' ],
                order: [
                    ['id', 'DESC']
                ],
                transaction: getTransaction
            });
            const category = await Category.findOne({
                logging: false,
                attributes: ['id', 'category'],
                where: {
                    id: subcategory.categoryId
                },
                transaction: getTransaction
            });
            return category;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, previous_category)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to get Category List for add subcategory / add product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Category List
 */
exports.getCategoryList = async (req, res, next) => {
    try {
        const categories = await sequelize.transaction(async getTransaction => {
            const categories = await Category.findAll({
                logging: false,
                attributes: ['id', 'category'],
                order: [
                    ['category', 'ASC']
                ],
                transaction: getTransaction
            });
            return categories;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, categories)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to add Sub Category
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.addSubCategory = async (req, res, next) => {
    try {
        const { categoryId, subcategory } = req.body;
        await sequelize.transaction(async addTransaction => {
            await Subcategory.create({
                subcategory,
                categoryId
            }, {
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_SUB_CATEGORY_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to get Sub Category By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - subcategory
 */
exports.getSubCategoryById = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_PARAMS];
        const subcategory = await sequelize.transaction(async getTransaction => {
            const subcategory = await Subcategory.findByPk(id, {
                logging: false,
                attributes: ['id', 'subcategory'],
                include: {
                    model: Category,
                    attributes: ['id', 'category']
                },
                distinct: true,
                transaction: getTransaction
            });
            return subcategory;
        });
        if (!subcategory) {
            throw new BadRequest(DEFAULT_ERROR);
        }
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, subcategory)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to Edit Sub Category By Id
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - message
 */
exports.editSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { categoryId, subcategory } = req.body;
        await sequelize.transaction(async editTransaction => {
            const _subcategory = await Subcategory.update({
                categoryId,
                subcategory
            }, {
                logging: false,
                where: {
                    id
                },
                transaction: editTransaction
            });
            if (_subcategory[0] === 0) {
                throw new BadRequest(EDIT_SUB_CATEGORY_CANNOT_BE_SAME_ERROR);
            }
        });
        return res.status(200).send(
            responseObj(true, EDIT_SUB_CATEGORY_SUCCESS)
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
            include: [
                {
                    model: Brand,
                },
                {
                    model: Category,
                },
                {
                    model: Subcategory
                }
            ],
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

/**
 * @description API interface to fetch deleted Products with pagination
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @method GET
 * @returns {Response} JSON
 */
 exports.getProductsTrash = async (req, res, next) => {
    try {
        const { order, page, size } = req.query;
        const { limit, offset } = pagination({ page, size });
        const products = await Product.findAndCountAll({
            logging: false,
            attributes: ['id', 'name', 'quantity', 'price'],
            limit,
            offset,
            order: order ? [order] : [['id', 'ASC']],
            where: {
                deletedAt: {
                    [Op.ne]: null
                }
            },
            include: [
                {
                    model: Brand,
                },
                {
                    model: Category,
                },
                {
                    model: Subcategory
                }
            ],
            distinct: true,
            paranoid: false
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
 * @description API interface to restore deleted Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
 exports.restoreProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!parseInt(id)) {
            throw new InternalServerError(DEFAULT_ERROR);
        }
        await Product.restore({
            logging: false,
            where: {
                id: parseInt(id)
            }
        });
        return res.status(200).send(
            responseObj(true, RESTORE_PRODUCT_SUCCESS)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to previous selected Brand for add Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Previous Brand
 */
exports.getProduct_previousSelectedBrand = async (req, res, next) => {
    try {
        const previous_brand = await sequelize.transaction(async getTransaction => {
            const product = await Product.findOne({
                logging: false,
                attributes: [ 'brandId' ],
                order: [
                    ['id', 'DESC']
                ],
                transaction: getTransaction
            });
            if (!product) {
                return {};
            }
            const brand = await Brand.findOne({
                logging: false,
                attributes: ['id', 'name'],
                where: {
                    id: product.brandId
                },
                transaction: getTransaction
            });
            return brand;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, previous_brand)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to previous selected Category for add Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Previous Category
 */
exports.getProduct_previousSelectedCategory = async (req, res, next) => {
    try {
        const previous_category = await sequelize.transaction(async getTransaction => {
            const product = await Product.findOne({
                logging: false,
                attributes: [ 'categoryId' ],
                order: [
                    ['id', 'DESC']
                ],
                transaction: getTransaction
            });
            if (!product) {
                return {};
            }
            const category = await Category.findOne({
                logging: false,
                attributes: ['id', 'category'],
                where: {
                    id: product.categoryId
                },
                transaction: getTransaction
            });
            return category;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, previous_category)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to previous selected Sub Category by categoryId for add Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Previous Sub Category
 */
exports.getProduct_previousSelectedSubcategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const previous_subcategory = await sequelize.transaction(async getTransaction => {
            const product = await Product.findOne({
                logging: false,
                attributes: [ 'subcategoryId' ],
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    categoryId
                },
                transaction: getTransaction
            });
            if (!product) {
                return {};
            }
            const subcategory = await Subcategory.findOne({
                logging: false,
                attributes: ['id', 'subcategory'],
                where: {
                    id: product.subcategoryId
                },
                transaction: getTransaction
            });
            return subcategory;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, previous_subcategory)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to get Sub Category List for add product by categoryId
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Sub Category List
 */
exports.getSubCategoryListByCategoryId = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const subcategories = await sequelize.transaction(async getTransaction => {
            const subcategories = await Subcategory.findAll({
                logging: false,
                attributes: ['id', 'subcategory'],
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    categoryId
                },
                transaction: getTransaction
            });
            return subcategories;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, subcategories)
        );
    } catch (error) {
        next(error);
    }
}

/**
 * @description API interface to get Brand List for add product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON - Brand List
 */
exports.getBrandList = async (req, res, next) => {
    try {
        const brands = await sequelize.transaction(async getTransaction => {
            const brands = await Brand.findAll({
                logging: false,
                attributes: ['id', 'name'],
                order: [
                    ['name', 'ASC']
                ],
                transaction: getTransaction
            });
            return brands;
        });
        return res.status(200).send(
            responseObj(true, DATA_FETCH_SUCCESS, brands)
        );
    } catch (error) {
        next(error);
    }
};

/**
 * @description API interface to Add Product
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 * @returns {Response} JSON
 */
exports.addProduct = async (req, res, next) => {
    try {
        const { name, description, quantity, price, brandId, categoryId, subcategoryId } = req.body;
        const productData = {
            name,
            description,
            quantity,
            price,
            brandId,
            categoryId,
            subcategoryId,
            imagePath: PRODUCTS_IMAGE_PATH + (req[REQUEST_FILENAME] || DEFAULT_PRODUCT_IMAGE_NAME)
        };
        await sequelize.transaction(async addTransaction => {
            await Product.create(productData, {
                logging: false,
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, ADD_PRODUCT_SUCCESS)
        );
    } catch (error) {
        console.log(typeof req.file);
        next(error);
    }
};
