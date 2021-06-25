'use strict';

const {
    ERROR_MESSAGES: {
        QUANTITY_NOTNULL_ERROR,
        QUANTITY_IS_INT_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require('sequelize');
const { sequelize } = require("../config/db-connection.config");
const { User } = require('./user.model');
const { Product } = require('./product.model');

const Cart = sequelize.define('cart', {
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
    }
}, {
    timestamps: false,
});

User.hasMany(Cart, {
    onDelete: 'CASCADE'
});
Cart.belongsTo(User);

Product.hasMany(Cart, {
    onDelete: 'CASCADE'
});
Cart.belongsTo(Product);


module.exports = { Cart };