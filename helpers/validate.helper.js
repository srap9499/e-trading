'use strict';

const Joi = require('joi');

const signUpSchema = Joi.object({
    userName: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    password: Joi.string()
        .min(5)
        .max(15)
        .required()
});

const signInSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    password: Joi.string()
        .min(5)
        .max(15)
        .required()
});

const verifySchema = Joi.object({
    id: Joi.number(),
    otp: Joi.string()
        .alphanum()
        .length(6)
        .required()
});

module.exports = {
    signUpSchema,
    verifySchema,
    signInSchema
};