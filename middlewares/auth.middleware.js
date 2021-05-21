'use strict';

// import jwt
const { verify } = require('jsonwebtoken');

// import environment variables
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const { User } = require('../models/user.model');

exports.authenticate = async (req, res, next) => {
    const token = req.cookies.jwt_token;
    if (!token) {
        return res.status(401).redirect('/auth/signIn');
    }
    const auth = new Promise((resolve, reject) => {
        verify(token, JWT_SECRET, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
    auth
    .then(userData => {
        req.userData = userData;
        next();
    })
    .catch(err => {
        console.log(err);
        return res.status(401).redirect('/auth/signIn');
    })
};