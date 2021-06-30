'use strict';

const {
    ERROR_MESSAGES: {
        CATEGORY_UNIQUE_ERROR,
        CATEGORY_NOTNULL_EMPTY_ERROR,
        CATEGORY_IS_ALPHA_ERROR,
        CATEGORY_LENGTH_ERROR,
        SUB_CATEGORY_NOTNULL_EMPTY_ERROR,
        SUB_CATEGORY_IS_ALPHA_ERROR,
        SUB_CATEGORY_LENGTH_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require('sequelize');
const { sequelize } = require('../config/db-connection.config');

const Category = sequelize.define('category', {
    category: {
        type: Sequelize.STRING(25),
        unique: {
            args: true,
            msg: CATEGORY_UNIQUE_ERROR
        },
        allowNull: false,
        defaultValue: "General",
        validate: {
            notNull: {
                msg: CATEGORY_NOTNULL_EMPTY_ERROR
            },
            notEmpty: {
                msg: CATEGORY_NOTNULL_EMPTY_ERROR
            },
            is: {
                args: /^[\w\s]+$/,
                msg: CATEGORY_IS_ALPHA_ERROR
            },
            len: {
                max: 25,
                msg: CATEGORY_LENGTH_ERROR
            }
        }
    }
}, {
    createdAt: false,
    updatedAt: false,
    paranoid: true
});

const Subcategory = sequelize.define('subcategory', {
    subcategory: {
        type: Sequelize.STRING(25),
        allowNull: false,
        defaultValue: "General",
        validate: {
            notNull: {
                msg: SUB_CATEGORY_NOTNULL_EMPTY_ERROR
            },
            notEmpty: {
                msg: SUB_CATEGORY_NOTNULL_EMPTY_ERROR
            },
            is: {
                args: /^[\w\s]+$/,
                msg: SUB_CATEGORY_IS_ALPHA_ERROR
            },
            len: {
                max: 25,
                msg: SUB_CATEGORY_LENGTH_ERROR
            }
        }
    }
}, {
    indexes: [
        {
            unique: true,
            fields: [ 'subcategory', 'categoryId' ]
        }
    ],
    createdAt: false,
    updatedAt: false,
    paranoid: true
});

Category.hasMany(Subcategory, {
    allowNull: false,
    onDelete: "CASCADE"
});
Subcategory.belongsTo(Category, {
    onDelete: "CASCADE"
});

module.exports = { Category, Subcategory };