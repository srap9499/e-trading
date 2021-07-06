'use strict';

const {
    INITIAL_WALLET_BONUS_AMOUNT,
    saltValue,
    roles,
    userStatus
} = require('../config/main.config');

const {
    SUCCESS_MESSAGES: {
        PASSWORD_CHANGE_SUCCESS,
    },
    ERROR_MESSAGES: {
        WRONG_OTP,
        WRONG_PASSWORD,
        INVALID_USER,
        USER_NOT_EXISTS,
        WRONG_CREDENTIALS,
    },
    REQUEST_PROPERTIES: {
        REQUEST_USERDATA
    },
    VIEW_PATH: {
        SHARED_VIEWS_PATH
    },
    SHARED_VIEWS: {
        SIGN_UP_VIEW,
        SIGN_IN_VIEW,
        VERIFY_ACCOUNT_VIEW
    },
    VIEW_TITLES: {
        SHARED_VIEW_TITLES: {
            SIGN_UP_TITLE,
            SIGN_IN_TITLE,
            VERIFY_ACCOUNT_TITLE
        }
    },
    COOKIE_NAMES: {
        AUTH_TOKEN
    },
    TOKEN_MAX_AGE: {
        AUTH_TOKEN_MAX_AGE,
    },
    COOKIE_MAX_AGE: {
        AUTH_TOKEN_COOKIE_MAX,
    },
    COUPON_TYPES: {
        COUPON_DYNAMIC
    }
} = require('../constants/main.constant');

// import functions from bcryptjs module for password hashing
const {
    hashSync,
    compareSync
} = require('bcryptjs');

const { generateToken } = require('../helpers/auth.helper');
const cryptoRandomString = require('crypto-random-string');
const { sendVerifyEmail, sendSignUpNotificationMail } = require('../helpers/mail.helper');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('../models/user.model');
const { Code } = require('../models/code.model');
const { Wallet } = require('../models/wallet.model');
const { Coupon } = require('../models/coupon.model');
const { dateAfterWeeks } = require('../helpers/date.helper');

const { BadRequest } = require('http-errors');
const { responseObj } = require('../helpers/response.helper');


// Render Sign Up page
exports.getSignUp = async (req, res, next) => {
    res.render(SHARED_VIEWS_PATH + SIGN_UP_VIEW, { message: {}, formData: {}, title: SIGN_UP_TITLE });
};

// POST Sign Up
exports.postSignUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const signUpTransaction = await sequelize.transaction();
    try {
        let userData;
        const hashedPassword = hashSync(password, saltValue);
        userData = {
            userName,
            email,
            password: hashedPassword,
            wallet: {},
            userroleId: roles.User
        };
        const user = await User.create(userData,
            {
                logging: false,
                include: {
                    model: Wallet
                },
                transaction: signUpTransaction
            });
        if (user) {
            const otp = cryptoRandomString(6);
            await Code.create({
                email: user.email,
                otp
            }, {
                logging: false,
                transaction: signUpTransaction
            });
            sendVerifyEmail({ userName: user.userName, email: user.email }, otp);
            sendSignUpNotificationMail({ userName: user.userName, email: user.email }, INITIAL_WALLET_BONUS_AMOUNT);
            await signUpTransaction.commit();
            return res.redirect('/auth/verify/' + user.id);
        }
        await signUpTransaction.commit();
        return res.status(400).send("No user created!");
    } catch (e) {
        console.log(e);
        await signUpTransaction.rollback();
        next({ error: e, view: SHARED_VIEWS_PATH + SIGN_UP_VIEW, title: SIGN_UP_TITLE });
    }
};

exports.getVerify = async (req, res, next) => {
    const { id } = req.params;
    const title = VERIFY_ACCOUNT_TITLE
    return res.render(SHARED_VIEWS_PATH + VERIFY_ACCOUNT_VIEW, { message: {}, formData: { id }, title });
};

exports.postVerify = async (req, res, next) => {
    const { id, otp } = req.body;
    const verifyTransaction = await sequelize.transaction();
    try {
        const user = await User.findOne({ logging: false, where: { id }, include: Wallet });
        const verified = await Code.findOne({ logging: false, where: { email: user.email, otp } });
        if (verified) {
            user.status = userStatus.Active;
            user.wallet.amount = INITIAL_WALLET_BONUS_AMOUNT;
            const coupon = await Coupon.create({
                name: "Buy One Get One Free",
                code: cryptoRandomString(6),
                type: COUPON_DYNAMIC,
                value: 50,
                notAfter: dateAfterWeeks(2)
            }, { logging: false, transaction: verifyTransaction });
            await user.wallet.save({ logging: false, transaction: verifyTransaction });
            await user.addCoupon(coupon, { logging: false, transaction: verifyTransaction });
            await user.save({ logging: false, transaction: verifyTransaction });
            await Code.destroy({ logging: false, where: { email: user.email }, transaction: verifyTransaction });
            await verifyTransaction.commit();
            return res.redirect('/auth/signIn');
        }
        await verifyTransaction.commit();
        return res.status(400).render(SHARED_VIEWS_PATH + VERIFY_ACCOUNT_VIEW, {
            message: {
                type: "error",
                body: WRONG_OTP
            },
            formData: req.body,
            title: VERIFY_ACCOUNT_TITLE
        });
    } catch (err) {
        await verifyTransaction.rollback();
        console.log(err.message);
        res.status(500).redirect('/auth/verify/' + id);
    }
};

exports.getSignIn = async (req, res, next) => {
    res.render(SHARED_VIEWS_PATH + SIGN_IN_VIEW, { message: { type: "success" }, formData: {}, title: SIGN_IN_TITLE });
};

exports.postSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ logging: false, where: { email } });
    if (!user) {
        return res.status(400).render(SHARED_VIEWS_PATH + SIGN_IN_VIEW, {
            message: {
                type: "error",
                body: INVALID_USER
            },
            errors: { email: USER_NOT_EXISTS },
            formData: req.body,
            title: SIGN_IN_TITLE
        });
    }
    if (user.status == userStatus.Pending) {
        return res.redirect('/auth/verify/' + user.id);
    }
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).render(SHARED_VIEWS_PATH + SIGN_IN_VIEW, {
            message: {
                type: "error",
                body: WRONG_CREDENTIALS
            },
            errors: {},
            formData: req.body,
            title: SIGN_IN_TITLE
        });
    }
    const userData = {
        id: user.id,
        userName: user.userName,
        email: user.email,
        roleId: user.userroleId
    }
    const token = generateToken(userData, AUTH_TOKEN_MAX_AGE);     // jwt authorization
    res.cookie(AUTH_TOKEN, token, { maxAge: AUTH_TOKEN_COOKIE_MAX, httpOnly: true });
    user.accessToken = token;
    await user.save();
    // res.status(200).send({ Message: "OK! Sign In successful!", "Token": token });
    if (user.userroleId == roles.SuperAdmin || user.userroleId == roles.SubAdmin) {
        return res.redirect('/admin');
    }
    res.redirect('/home');
};

exports.getSignOut = async (req, res, next) => {
    try {
        res.clearCookie(AUTH_TOKEN);
        return res.redirect('/auth/signIn');
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.postChangePassword = async (req, res, next) => {
    const { id } = req[REQUEST_USERDATA];
    const { password, new_password } = req.body;
    try {
        await sequelize.transaction(async changePasswordTransaction => {
            const user = await User.findOne({
                logging: false,
                attributes: ['id', 'password'],
                where: {
                    id
                },
                transaction: changePasswordTransaction
            });
            const isMatch = compareSync(password, user.password);
            if (!isMatch) {
                throw new BadRequest(WRONG_PASSWORD);
            }
            user.password = hashSync(new_password, saltValue);
            await user.save({ transaction: changePasswordTransaction });
        });
        return res.status(200).send(
            responseObj(true, PASSWORD_CHANGE_SUCCESS)
        );
    } catch (error) {
        console.log(error);
        next(error);
    }
};