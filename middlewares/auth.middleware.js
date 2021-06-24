'use strict';

const { Unauthorized } = require('http-errors');
// import jwt
const { verify } = require('jsonwebtoken');

// import config
const {
    development: {
        jwt_secret,
        roles,
        errMsgs
    }
} = require('../config/development.config');


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
    const token = req.cookies.jwt_token;
    if (!token) {
        return res.status(401).redirect('/auth/signIn');
    }
    verifyToken(token)
        .then(userData => {
            req.userData = userData;
            next();
        })
        .catch(err => {
            console.log(err);
            return res.status(401).redirect('/auth/signIn');
        })
};

exports.isAdmin = async (req, res, next) => {
    const { roleId } = req.userData;
    try {
        const isAdmin = parseInt(roleId) == parseInt(roles.SubAdmin) || parseInt(roleId) == parseInt(roles.SuperAdmin);
        if (!isAdmin) {
            throw new Unauthorized(errMsgs.auth401);
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.isSuperAdmin = async (req, res, next) => {
    const {roleId} = req.userData;
    try {
        const isSuperAdmin = parseInt(roleId) == parseInt(roles.SuperAdmin);
        if (!isSuperAdmin) {
            throw new Unauthorized(errMsgs.auth401);
        }
        next();
    } catch (error) {
        next(error);
    }
};

exports.isUser = async (req, res, next) => {
    const {roleId} = req.userData;
    try {
        const isUser = parseInt(roleId) == parseInt(roles.User);
        if (!isUser) {
            throw new Unauthorized(errMsgs.auth401);
        }
        next();
    } catch (error) {
        next(error);
    }
}