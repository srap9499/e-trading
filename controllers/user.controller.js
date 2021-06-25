'use strict';

const {
    SUCCESS_MESSAGES: {
        UPDATE_PROFILE_SUCCESS,
        ADD_AMOUNT_SUCCESS,
        DATA_FETCH_SUCCESS,
        WALLET_AMOUNT_FETCH_SUCCESSFULL,
        ORDER_HISTORY_FETCH_SUCCESS
    },
    ERROR_MESSAGES: {
        WRONG_OTP,
        EMAIL_ALREADY_EXISTS,
        USER_NOT_FOUND
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
    getCouponPagination,
    getCouponPaginationData,
    pagination,
    paginationMetaData
} = require("../helpers/pagination.helper");

const { Op } = require('sequelize');
const { User } = require("../models/user.model");
const { Wallet } = require('../models/wallet.model');
const { Product } = require('../models/product.model');
const { Coupon } = require('../models/coupon.model');
const { Order, OrderDetail } = require("../models/order.model");
const { sequelize } = require("../config/db-connection.config");
const { BadRequest, NotFound } = require("http-errors");
const cryptoRandomString = require("crypto-random-string");
const { VerifyCode } = require("../models/code.model");
const { sendUpdateDetailVerifyEmail } = require("../helpers/mail.helper");
const { UserRole } = require("../models/role.model");
const { dateAfterMinutes, formatDateTime } = require("../helpers/date.helper");
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

exports.getMyCoupons = async (req, res, next) => {
    const { id } = req[REQUEST_USERDATA];
    const view = USER_VIEWS_PATH + COUPON_VIEW;
    const title = COUPON_TITLE;
    const { page, size } = req.query;
    try {
        const { limit, offset } = getCouponPagination({ page, size });
        const user = await getUserById(id);
        const data = await Coupon.findAndCountAll({
            logging: false,
            limit,
            offset,
            attributes: ["name", "code", "type", "value", "notAfter"],
            where: {
                userId: user.id,
                status: "unused",
                notAfter: {
                    [Op.gte]: new Date()
                }
            },
        });
        let renderData = getCouponPaginationData({ data, page, limit });
        renderData.title = title;
        renderData.user = user;
        return res.status(200).render(view, renderData);
    } catch (error) {
        next(error);
    }
};

exports.getUserData = async (req, res, next) => {
    const { id } = req[REQUEST_USERDATA];
    try {
        const user = await getUserById(id);
        if (!user) {
            throw new NotFound(USER_NOT_FOUND);
        }
        return res.status(200).send(
                responseObj(true, DATA_FETCH_SUCCESS, { user })
            );
    } catch (error) {
        next(error);
    }
};

// @desc Order History Data
// @route GET /user/orders/history
exports.getOrderHistoryData = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_USERDATA];
        const { status, sortBy, orderBy, page, size } = req.query;
        const order = sortBy ? [ [sortBy, orderBy] ] : undefined;
        const where = status ? { status, userId: id } : { userId: id };
        const { limit, offset } = pagination({ page, size });
        const order_histories = await Order.findAndCountAll({
            logging: false,
            limit,
            offset,
            order,
            where,
            include: {
                model: OrderDetail,
                attributes: [ 'quantity', 'total' ],
                order: [ 'id', 'ASC'],
                include: {
                    model: Product,
                    attributes: ['id', 'name', 'price']
                }
            },
            distinct: true
        });
        const data = paginationMetaData(order_histories, page, limit);
        return res.status(200).send(
            responseObj(true, ORDER_HISTORY_FETCH_SUCCESS, data)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// @desc fetch wallet amount
// @route GET /user/wallet/amount
exports.getWalletAmount = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    try {
        const walletdata = await Wallet.findOne({
            logging: false,
            attributes: ['amount'],
            where: {
                userId
            }
        });
        return res.status(200).send(
            responseObj(true, WALLET_AMOUNT_FETCH_SUCCESSFULL, walletdata)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// @desc Add amount to wallet
// @route POST /user/wallet/addmount
exports.addAmount = async (req, res, next) => {
    const { id: userId } = req[REQUEST_USERDATA];
    const { amount } = req.body;
    try {
        await sequelize.transaction(async addAmountTransaction => {
            const wallet = await Wallet.findOne({
                attributes: ['id', 'amount'],
                where: {
                    userId
                },
                transaction: addAmountTransaction,
            });
            wallet.amount = parseFloat(wallet.amount) + parseFloat(amount);
            await wallet.save({ transaction: addAmountTransaction });
        });
        return res.status(200).send(
            responseObj(true, ADD_AMOUNT_SUCCESS)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.updateUserDetails = async (req, res, next) => {
    const { id } = req[REQUEST_USERDATA];
    const { name, email } = req.body;
    try {
        const result = await sequelize.transaction(async updateUserDetailsTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email' ],
                where: {
                    id
                },
                transaction: updateUserDetailsTransaction
            });
            let emailId = user.email;
            if (email) {
                const isAlready = await User.findOne({
                    logging: false,
                    attributes: [ 'id', 'userName', 'email' ],
                    where: {
                        id : {
                            [Op.ne]: id
                        },
                        email
                    },
                    transaction: updateUserDetailsTransaction
                });
                if (isAlready) {
                    throw new BadRequest(EMAIL_ALREADY_EXISTS);
                }
                emailId = email;
            }
            const otp = cryptoRandomString(6);
            console.log(formatDateTime(dateAfterMinutes(5)));
            await VerifyCode.create({
                email: emailId,
                otp,
                for: 'profile_update',
                notAfter: dateAfterMinutes(5)
            }, {
                loggong: false,
                transaction: updateUserDetailsTransaction
            });
            await sendUpdateDetailVerifyEmail({ userName: name??user.userName??'Anonymous', email: emailId }, otp, '5 minutes');
            return { email: emailId };
        });
        return res.status(200).send(
            responseObj(true, `Verify OTP sent to ${result.email}`)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.verifyUpdateUserDetails = async (req, res, next) => {
    const { id } = req[REQUEST_USERDATA];
    const { name, email, otp } = req.body;
    try {
        await sequelize.transaction(async verifyTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: [ 'id', 'userName', 'email', 'userroleId' ],
                where: {
                    id
                },
                transaction: verifyTransaction
            });
            const verifyCode = await VerifyCode.findOne({
                logging: false,
                attributes: [ 'id', 'otp', 'status' ],
                where: { 
                    email,
                    for: 'profile_update',
                    status: 'unused',
                    notAfter: {
                        [Op.gte]: new Date()
                    }
                },
                order: [
                    [ 'id', 'DESC' ]
                ],
                transaction: verifyTransaction
            });
            if (verifyCode.otp != otp) {
                throw new BadRequest(WRONG_OTP);
            }
            [ user["userName"], user["email"] ] = [ name, email ];
            await user.save({ logging: false, transaction: verifyTransaction });
            verifyCode.status = 'used';
            await verifyCode.save({ logging: false, transaction: verifyTransaction });
            return { email };
        });
        return res.status(200).send(
            responseObj(true, UPDATE_PROFILE_SUCCESS)
        );
    } catch (error) {
        console.log(error.name, error.message);
        next(error);
    }
};