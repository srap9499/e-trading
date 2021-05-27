'use strict';

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
            isInt: true
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