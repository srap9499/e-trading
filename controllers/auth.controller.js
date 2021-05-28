'use strict';

// import environment variables
require('dotenv').config();
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


// Render Sign Up page
exports.getSignUp = async (req, res, next) => {
    res.render('signup', { message: {}, formData: {}, title: "Sign Up" });
};

// POST Sign Up
exports.postSignUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    const signUpTransaction = await sequelize.transaction();
    try {
        let userData;
        const hashedPassword = hashSync(password, 12);
        userData = {
            userName,
            email,
            password: hashedPassword,
            wallet: {}
        };
        const user = await User.create(userData, { include: { model: Wallet }, transaction: signUpTransaction })
        if (user) {
            const otp = cryptoRandomString(6);
            console.log('otp::::::::: ', otp);
            await Code.create({
                email: user.email,
                otp
            },{ transaction: signUpTransaction });
            sendVerifyEmail({ userName: user.userName, email: user.email }, otp);
            sendSignUpNotificationMail({userName: user.userName, email: user.email }, process.env.N_BONUS_AMOUNT || 500);
            await signUpTransaction.commit();
            return res.redirect('/auth/verify/' + user.id);
        }
        await signUpTransaction.commit();
        return res.status(400).send("No user created!");
    } catch (e) {
        await signUpTransaction.rollback();
        next({ error: e, view: "signUp", title: "Sign Up"});
    }
};

exports.getVerify = async (req, res, next) => {
    const { id } = req.params;
    const title = "Verify Account"
    return res.render('verify', { message: {}, formData: { id }, title});
};

exports.postVerify = async (req, res, next) => {
    const { id, otp } = req.body;
    const verifyTransaction = await sequelize.transaction();
    try {
        const user = await User.findOne({ logging: false, where: { id }, include: Wallet });
        const verified = await Code.findOne({ logging: false, where: { email: user.email, otp } });
        if (verified) {
            user.status = 'active';
            user.wallet.amount = process.env.N_BONUS_AMOUNT || 500;
            const coupon = await Coupon.create({
                name: "Buy One Get One Free",
                code: cryptoRandomString(6),
                type: "dynamic",
                value: 50,
                notAfter: dateAfterWeeks(2)
            },{ logging: false, transaction: verifyTransaction });
            await user.wallet.save({ logging: false, transaction: verifyTransaction });
            await user.addCoupon(coupon, { logging: false, transaction: verifyTransaction });
            await user.save({ logging: false, transaction: verifyTransaction });
            await Code.destroy({ logging: false, where: { email: user.email }, transaction: verifyTransaction });
            await verifyTransaction.commit();
            return res.redirect('/auth/signIn');
        }
        await verifyTransaction.commit();
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