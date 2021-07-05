'use strict';

const { BadRequest } = require("http-errors");
const {
    ERROR_MESSAGES: {
        DEFAULT_ERROR
    },
    REQUEST_PROPERTIES: {
        REQUEST_PARAMS
    },
    COOKIE_NAMES: {
        EDIT_BRAND_TOKEN,
        EDIT_CATEGORY_TOKEN
    },
    TOKEN_MAX_AGE: {
        EDIT_BRAND_TOKEN_MAX_AGE,
        EDIT_CATEGORY_TOKEN_MAX_AGE
    },
    COOKIE_MAX_AGE: {
        EDIT_BRAND_COOKIE_MAX_AGE,
        EDIT_CATEGORY_COOKIE_MAX_AGE
    }
} = require("../constants/main.constant");
const { generateToken, verifyToken } = require("../helpers/auth.helper");

exports.createBrandCookie = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_PARAMS];
        const token = generateToken({id}, EDIT_BRAND_TOKEN_MAX_AGE);
        await res.cookie(EDIT_BRAND_TOKEN, token, {maxAge: EDIT_BRAND_COOKIE_MAX_AGE, httpOnly: true});
        next();
    } catch (error) {
        next(error);
    }
};

exports.getBrandCookie = async (req, res, next) => {
    try {
        const token = req.cookies[EDIT_BRAND_TOKEN];
        if (!token) {
            throw new BadRequest(DEFAULT_ERROR);
        }
        verifyToken(token)
        .then(data => {
            req[REQUEST_PARAMS] = data;
            next();
        })
        .catch(error => {
            throw new BadRequest(DEFAULT_ERROR);
        });
    } catch (error) {
        next(error);
    }
};

exports.createCategoryCookie = async (req, res, next) => {
    try {
        const { id } = req[REQUEST_PARAMS];
        const token = generateToken({id}, EDIT_CATEGORY_TOKEN_MAX_AGE);
        await res.cookie(EDIT_CATEGORY_TOKEN, token, {maxAge: EDIT_CATEGORY_COOKIE_MAX_AGE, httpOnly: true});
        next();
    } catch (error) {
        next(error);
    }
};

exports.getCategoryCookie = async (req, res, next) => {
    try {
        const token = req.cookies[EDIT_CATEGORY_TOKEN];
        if (!token) {
            throw new BadRequest(DEFAULT_ERROR);
        }
        verifyToken(token)
        .then(data => {
            req[REQUEST_PARAMS] = data;
            next();
        })
        .catch(error => {
            throw new BadRequest(DEFAULT_ERROR);
        });
    } catch (error) {
        next(error);
    }
};