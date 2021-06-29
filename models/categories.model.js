'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('../config/db-connection.config');

const Category = sequelize.define('category', {
    category: {
        type: Sequelize.STRING(25),
        unique: true,
        defaultValue: "General"
    }
}, {
    createdAt: false,
    updatedAt: false,
    paranoid: true
});

const Subcategory = sequelize.define('subcategory', {
    subcategory: {
        type: Sequelize.STRING(25),
        defaultValue: "General"
    }
}, {
    createdAt: false,
    updatedAt: false,
    paranoid: true
});

Category.hasMany(Subcategory, {
    onDelete: "CASCADE"
});
Subcategory.belongsTo(Category, {
    onDelete: "CASCADE"
});

module.exports = { Category, Subcategory };