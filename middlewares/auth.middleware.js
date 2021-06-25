'use strict';

const { Unauthorized } = require('http-errors');
// import jwt
const { verify } = require('jsonwebtoken');

// import config
const {
    jwt_secret,
    roles,
} = require('../config/main.config');

const {
    ERROR_MESSAGES: {
        UNAUTHORIZED_REQUEST
    },
    REQUEST_PROPERTIES: {
        REQUEST_COOKIES,
        REQUEST_USERDATA
    },
    COOKIE_NAMES: {
        AUTH_TOKEN
    }
} = require('../constants/main.constant');


const verifyToken = token => {
    return new Promise((resolve, reject) => {
        verify(token, jwt_secret, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

exports.authenticate = async (req, res, next) => {
    const token = req[REQUEST_COOKIES][AUTH_TOKEN];
    if (!token) {
        return res.status(401).redirect('/auth/signIn');
    }
    verifyToken(token)
        .then(userData => {
            req[REQUEST_USERDATA] = userData;
            next();
        })
        .catch(err => {
            console.log(err);
            return res.status(401).redirect('/auth/signIn');
        })
};

exports.isAdmin = async (req, res, next) => {
    const { roleId } = req[REQUEST_USERDATA];
    try {
        const isAdmin = parseInt(roleId) == parseInt(roles.SubAdmin) || parseInt(roleId) == parseInt(roles.SuperAdmin);
        if (!isAdmin) {
            throw new Unauthorized(UNAUTHORIZED_REQUEST);
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.isSuperAdmin = async (req, res, next) => {
    const { roleId } = req[REQUEST_USERDATA];
    try {
        const isSuperAdmin = parseInt(roleId) == parseInt(roles.SuperAdmin);
        if (!isSuperAdmin) {
            throw new Unauthorized(UNAUTHORIZED_REQUEST);
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.isUser = async (req, res, next) => {
    const { roleId } = req[REQUEST_USERDATA];
    try {
        const isUser = parseInt(roleId) == parseInt(roles.User);
        if (!isUser) {
            throw new Unauthorized(UNAUTHORIZED_REQUEST);
        }
        next();
    } catch (error) {
        next(error);
    }
}