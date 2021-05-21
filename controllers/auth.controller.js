'use strict';

// import functions from bcryptjs module for password hashing
const {
    hashSync,
    compareSync
} = require('bcryptjs');

const { generateToken } = require('../helpers/auth.helper');
const { sendVerifyEmail } = require('../helpers/mail.helper');
const { User } = require('../models/user.model');


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
        password: hashedPassword
    };
    const user = await User.create(userData)
        .then(user => {
            if (user) {
                sendVerifyEmail({ userName: user.userName, email: user.email }, "A0TpqS");
                return res.status(200).redirect('/auth/signIn');
            }
            res.status(400).send("No user created!");
        })
        .catch(err => {
            res.status(400).send(err);
        });
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
    const isMatch = compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid Email ID or Password!');
    }
    const userData = {
        userName: user.userName,
        email: user.email
    }
    const token = generateToken(userData, 2*60);     // jwt authorization
    res.cookie('jwt_token', token, {maxAge: 2*60*1000, httpOnly: true});
    user.accessToken = token;
    await user.save();
    // res.status(200).send({ Message: "OK! Sign In successful!", "Token": token });
    res.redirect('/home');
};