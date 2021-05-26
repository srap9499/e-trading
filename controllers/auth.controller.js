'use strict';

// import environment variables
require('dotenv').config();
// import functions from bcryptjs module for password hashing
const {
    hashSync,
    compareSync
} = require('bcryptjs');

const {
    signUpSchema,
    verifySchema,
    signInSchema
} = require('../helpers/validate.helper');

const {
    joiErrorFormatter,
    sequelizeErrorFormatter
} = require('../helpers/error-formatter.helper');

const { generateToken } = require('../helpers/auth.helper');
const cryptoRandomString = require('crypto-random-string');
const { sendVerifyEmail } = require('../helpers/mail.helper');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('../models/user.model');
const { Code } = require('../models/code.model');
const { Wallet } = require('../models/wallet.model');


// Render Sign Up page
exports.getSignUp = async (req, res, next) => {
    res.render('signup', { message: {}, formData: {}, title: "Sign Up" });
};

// POST Sign Up
exports.postSignUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const validateResult = signUpSchema.validate(req.body, {
        abortEarly: false
    });
    if (validateResult.error) {
        return res.status(400).render('signUp', {
            message: {
                type: "error",
                body: "Validation Errors"
            },
            errors: joiErrorFormatter(validateResult.error),
            formData: req.body,
            title: "Sign Up"
        });
    }
    try {
        let userData;
        const hashedPassword = hashSync(password, 12);
        userData = {
            userName,
            email,
            password: hashedPassword,
            wallet: {}
        };
        const user = await User.create(userData, { include: { model: Wallet } })
        if (user) {
            const otp = cryptoRandomString(6);
            console.log('otp::::::::: ', otp);
            await Code.create({
                email: user.email,
                otp
            });
            sendVerifyEmail({ userName: user.userName, email: user.email }, otp);
            return res.redirect('/auth/verify/' + user.id);
        }
        res.status(400).send("No user created!");
    } catch (e) {
        if (e.name === 'SequelizeValidationError') {
            return res.status(400).render('signUp', {
                message: {
                    type: "error",
                    body: "Validation Errors"
                },
                errors: sequelizeErrorFormatter(e),
                formData: req.body,
                title: "Sign Up"
            });
        }
        res.status(400).send(sequelizeErrorFormatter(e));
    }
};

exports.getVerify = async (req, res, next) => {
    const { id } = req.params;
    const title = "Verify Account"
    return res.render('verify', { message: {}, formData: { id }, title});
};

exports.postVerify = async (req, res, next) => {
    const { id, otp } = req.body;
    const validateResult = verifySchema.validate(req.body, {
        abortEarly: false
    });
    if (validateResult.error) {
        return res.status(400).render('verify', {
            message: {
                type: "error",
                body: "Validation Error"
            },
            errors: joiErrorFormatter(validateResult.error),
            formData: req.body,
            title: "Verify Account"
        });
    }
    const verifyTransaction = await sequelize.transaction();
    try {
        const user = await User.findOne({ where: { id }, include: Wallet });
        const verified = await Code.findOne({ where: { email: user.email, otp } });
        if (verified) {
            user.status = 'active';
            user.wallet.amount = process.env.N_BONUS_AMOUNT || 500;
            await user.wallet.save({ transaction: verifyTransaction });
            await user.save({ transaction: verifyTransaction });
            await Code.destroy({ where: { email: user.email }, transaction: verifyTransaction });
            await verifyTransaction.commit();
            return res.redirect('/auth/signIn');
        }
        return res.status(400).render('verify', {
            message: {
                type: "error",
                body: "Invalid OTP"
            },
            formData: req.body,
            title: "Verify Account"
        });
    } catch (err) {
        await verifyTransaction.rollback();
        console.log(err.message);
        res.status(500).redirect('/auth/verify/' + id);
    }
};

exports.getSignIn = async (req, res, next) => {
    res.render('signin', { message: { type: "success"}, formData: {}, title: "Sign In" });
};

exports.postSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    const validateResult = signInSchema.validate(req.body, {
        abortEarly: false
    });
    if (validateResult.error) {
        return res.status(400).render('signIn', {
            message: {
                type: "error",
                body: "Validation Errors"
            },
            errors: joiErrorFormatter(validateResult.error),
            formData: req.body,
            title: "Sign In"
        });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(400).render('signIn', {
            message: {
                type: "error",
                body: "Invalid User!"
            },
            errors: { email: "User does not exists!"},
            formData: req.body,
            title: "Sign In"
        });
    }
    if (user.status == 'pending') {
        return res.redirect('/auth/verify/' + user.id);
    }
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).render('signIn', {
            message: {
                type: "error",
                body: "Invalid Email ID or Password!"
            },
            errors: {},
            formData: req.body,
            title: "Sign In"
        });    }
    const userData = {
        userName: user.userName,
        email: user.email
    }
    const token = generateToken(userData, 60 * 60);     // jwt authorization
    res.cookie('jwt_token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
    user.accessToken = token;
    await user.save();
    // res.status(200).send({ Message: "OK! Sign In successful!", "Token": token });
    res.redirect('/home');
};