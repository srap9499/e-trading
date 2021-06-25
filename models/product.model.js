'use strict';

const {
    ERROR_MESSAGES: {
        PRODUCT_NAME_NOTNULL_ERROR,
        PRODUCT_NAME_LENGTH_ERROR,
        QUANTITY_NOTNULL_ERROR,
        QUANTITY_IS_INT_ERROR,
        PRICE_NOTNULL_ERROR,
        PRICE_ISDECIMAL_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require('sequelize');

const { sequelize } = require('../config/db-connection.config');
const { Brand } = require('./brand.model');
const { Category, Subcategory } = require('./categories.model');

const Product = sequelize.define('product', {
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: PRODUCT_NAME_NOTNULL_ERROR
            },
            len: {
                min: 2,
                max: 50,
                msg: PRODUCT_NAME_LENGTH_ERROR
            },
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: QUANTITY_NOTNULL_ERROR
            },
            isInt: {
                msg: QUANTITY_IS_INT_ERROR
            }
        }
    },
    price: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: PRICE_NOTNULL_ERROR
            },
            isDecimal: {
                msg: PRICE_ISDECIMAL_ERROR
            }
        }
    },
    imagePath: {
        type: Sequelize.STRING(128),
        allowNull: false,
        defaultValue: 'images/products/default.jpg'
    }
}, {
    paranoid: true  
});

Brand.hasMany(Product, {
    onDelete: 'CASCADE'
});
Product.belongsTo(Brand);

Category.hasMany(Product, {
    onDelete: 'SET NULL'
});
Product.belongsTo(Category);

Subcategory.hasMany(Product, {
    onDelete: 'SET NULL'
});
Product.belongsTo(Subcategory);

module.exports = { Product };