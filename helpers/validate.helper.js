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
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),

    password: Joi.string()
        .min(5)
        .max(15)
        .required(),
    confirm_password: Joi.ref("password")
})
    .with("password", "confirm_password");

const addBrandSchema = Joi.object({
    name: Joi.string()
        .regex(/^\S[\w\s]+\S$/, 'Words')
        .min(2)
        .max(40)
        .required()
});

const editBrandSchema = addBrandSchema;

const addCategorySchema = Joi.object({
    category: Joi.string()
        .regex(/^\S[\w\s]+\S$/, "Words")
        .min(2)
        .max(25)
        .required()
});

const editCategorySchema = addCategorySchema;

const addSubCategorySchema = Joi.object({
    categoryId: Joi.number()
        .min(1)
        .required(),
    subcategory: Joi.string()
        .regex(/^\S[\w\s]+\S$/, "Words")
        .min(2)
        .max(25)
        .required()
});

const editSubCategorySchema = addSubCategorySchema;

const addProductSchema = Joi.object({
    name: Joi.string()
        .trim()
        .regex(/^[\w\s]*$/, 'Words')
        .min(2)
        .max(50)
        .required(),
    quantity: Joi.number()
        .integer()
        .min(1)
        .required(),
    price: Joi.number()
        .precision(2)
        .min(0)
        .positive()
        .required(),
    brandId: Joi.number()
        .required()
        .integer()
        .min(1)
        .messages({
          'number.base': `Please Select Brand!`,
          'number.empty': `Please Select Brand!`,
          'number.min': `Please Select Brand!`,
          'any.required': `Please Select Brand!`
        }),
    categoryId: Joi.number()
        .required()
        .integer()
        .min(1)
        .messages({
          'number.base': `Please Select Category!`,
          'number.empty': `Please Select Category!`,
          'number.min': `Please Select Category!`,
          'any.required': `Please Select Category!`
        }),
    subcategoryId: Joi.number()
        .required()
        .integer()
        .min(1)
        .messages({
          'number.base': `Please Select Sub Category!`,
          'number.empty': `Please Select Sub Category!`,
          'number.min': `Please Select Sub Category!`,
          'any.required': `Please Select Sub Category!`
        }),
    description: Joi.string()
        .min(0)
        .max(128)
});

const signUpSchema = Joi.object({
    userName: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),

    password: Joi.string()
        .min(5)
        .max(15)
        .required()
});

const signInSchema = Joi.object({
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),

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
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } })
});

const editProfileSchema = Joi.object({
    userName: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } })
});;

const verifyChangeUserDetailSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(64)
        .required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
    otp: Joi.string()
        .alphanum()
        .length(6)
        .required()
})
    .or('name', 'email');

module.exports = {
    addSubAdminSchema,
    addBrandSchema,
    editBrandSchema,
    addCategorySchema,
    editCategorySchema,
    addSubCategorySchema,
    editSubCategorySchema,
    addProductSchema,
    editProfileSchema,
    signUpSchema,
    verifySchema,
    signInSchema,
    addAmountSchema,
    changePasswordSchema,
    changeUserDetailSchema,
    verifyChangeUserDetailSchema
};