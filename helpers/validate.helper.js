'use strict';

const Joi = require('joi');

const addSubAdminSchema = Joi.object({
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
        .required(),
    confirm_password: Joi.ref("password")
})
    .with("password", "confirm_password");

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

const addAmountSchema = Joi.object({
    amount: Joi.number()
        .min(0)
        .required()
});

const changePasswordSchema = Joi.object({
    password: Joi.string()
        .min(5)
        .max(15)
        .required(),
    new_password: Joi.string()
        .min(5)
        .max(15)
        .required(),
    confirm_password: Joi.ref('new_password')
})
    .with('new_password', 'confirm_password');

const changeUserDetailSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
    .or('name', 'email');

const verifyChangeUserDetailSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    otp: Joi.string()
        .alphanum()
        .length(6)
        .required()
})
    .or('name', 'email');

module.exports = {
    addSubAdminSchema,
    signUpSchema,
    verifySchema,
    signInSchema,
    addAmountSchema,
    changePasswordSchema,
    changeUserDetailSchema,
    verifyChangeUserDetailSchema
};