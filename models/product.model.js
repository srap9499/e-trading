'use strict';

const Sequelize = require('sequelize');

const { sequelize } = require('../config/db-connection.config');
const { Brand } = require('./brand.model');
const { Category, Subcategory } = require('./categories.model');

const Product = sequelize.define('product', {
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
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