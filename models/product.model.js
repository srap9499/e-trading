'use strict';

const Sequelize = require('sequelize');

const { sequelize } = require('../config/db-connection.config');

const Product = sequelize.define('product', {
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [2, 50],
            notNull: true,
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true
        }
    },
    price: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    paranoid: true  
});

module.exports = { Product };