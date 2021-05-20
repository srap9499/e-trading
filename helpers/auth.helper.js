'use strict';

// import jwt for token
const {
    sign
} = require('jsonwebtoken');

// configure environment variables
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (user, interval) => {
    const token = sign(user, JWT_SECRET, { expiresIn: interval });
    return token;
};