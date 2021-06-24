'use strict';

const {
    development: {
        saltValue,
        userStatus,
        roles,
        errMsgs,
        Msgs
    }
} = require('../config/development.config');
const { hashSync } = require("bcryptjs");
const { UserRole } = require("../models/role.model");
const { User } = require("../models/user.model");
const { sequelize } = require('../config/db-connection.config');
const { responseObj } = require('../helpers/response.helper');
const { pagination, paginationMetaData } = require('../helpers/pagination.helper');
const { InternalServerError } = require('http-errors');


const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        logging: false,
        attributes: ['id', 'userName', 'email'],
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
exports.renderView = (view = 'dashboard', title = 'E-Trading') => {
    view = `admin/${view}`;
    return async (req, res, next) => {
        const { id } = req.userData;
        try {
            const user = await getUserById(id);
            return res.status(200).render(view, {
                user,
                title
            });
        } catch (error) {
            return res.status(error.status).send({
                message: {
                    type: "error",
                    body: error.message
                }
            });
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
            responseObj(true, Msgs.add200)
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
            attributes: [ 'id', 'userName', 'email', 'userroleId' ],
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
            responseObj(true, Msgs.get200, data)
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
        console.log(id);
        if (!parseInt(id)) {
            throw new InternalServerError(errMsgs.err500);
        }
        await User.destroy({
            logging: false,
            where: {
                id: parseInt(id),
                userroleId: roles.SubAdmin
            }
        });
        return res.status(200).send(
            responseObj(true, Msgs.del200)
        );
    } catch (error) {
        next(error);
    }
};