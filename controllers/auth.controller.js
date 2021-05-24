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
const { sendVerifyEmail } = require('../helpers/mail.helper');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('../models/user.model');
const { Code } = require('../models/code.model');
const { Wallet } = require('../models/wallet.model');


// Render Sign Up page
exports.getSignUp = async (req, res, next) => {
    res.render('signup', { title: "Sign Up" });
};

// POST Sign Up
exports.postSignUp = async (req, res, next) => {
    const { userName, email, password } = req.body;
    if (!password) {
        return res.status(400).send("Please Provide Password");
    }
    let userData;
    const hashedPassword = hashSync(password, 12);
    userData = {
        userName,
        email,
        password: hashedPassword,
        wallet: {}
    };
    const user = await User.create(userData, { include: { model: Wallet } })
        .then(user => {
            if (user) {
                const otp = cryptoRandomString(6);
                console.log('otp::::::::: ', otp);
                Code.create({
                    email: user.email,
                    otp
                });
                sendVerifyEmail({ userName: user.userName, email: user.email }, otp);
                return res.redirect('/auth/verify/'+ user.id);
            }
            res.status(400).send("No user created!");
        })
        .catch(err => {
            res.status(400).send(err);
        });
};

exports.getVerify = async (req, res, next) => {
    const userId = req.params.id;
    const title = "Verify Account"
    return res.render('verify', { title, userId });
};

exports.postVerify = async (req, res, next) => {
    const { id, otp } = req.body;
    if (!otp) {
        res.status(400).redirect('/auth/verify/' + id);
    }
    const verifyTransaction = await sequelize.transaction();
    try {
        const user = await User.findOne({ where: { id }, include: Wallet });
        const verified = await Code.findOne({where: { email: user.email, otp }});
        if (verified) {
            user.status = 'active';
            user.wallet.amount = process.env.N_BONUS_AMOUNT || 500;
            await user.wallet.save({transaction: verifyTransaction});
            await user.save({transaction: verifyTransaction});
            await Code.destroy({ where: { email: user.email }, transaction: verifyTransaction });
            await verifyTransaction.commit();
            return res.redirect('/auth/signIn');
        }
        res.status(400).redirect('/auth/verify/' + id);
    } catch(err) {
        await verifyTransaction.rollback();
        console.log(err.message);
        res.status(500).redirect('/auth/verify/' + id);
    }
};

exports.getSignIn = async (req, res, next) => {
    res.render('signin', { title: "Sign In"});
};

exports.postSignIn = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Plaese provide all fields: Email ID and Password");
    }
    const user = await User.findOne({where: { email }});
    if (!user) {
        // return res.status(404).json(`Invalid Email ID: ${email}`);
        return res.status(404).redirect('/auth/signIn');
    }
    if (user.status == 'pending') {
        return res.redirect('/auth/verify/' + user.id);
    }
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid Email ID or Password!');
    }
    const userData = {
        userName: user.userName,
        email: user.email
    }
    const token = generateToken(userData, 60*60);     // jwt authorization
    res.cookie('jwt_token', token, {maxAge: 60*60*1000, httpOnly: true});
    user.accessToken = token;
    await user.save();
    // res.status(200).send({ Message: "OK! Sign In successful!", "Token": token });
    res.redirect('/home');
};