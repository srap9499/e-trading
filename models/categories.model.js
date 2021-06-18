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
    timestamps: false
});

const Subcategory = sequelize.define('subcategory', {
    subcategory: {
        type: Sequelize.STRING(25),
        defaultValue: "General"
    }
}, {
    timestamps: false
});

Category.hasMany(Subcategory, {
    onDelete: "CASCADE"
});
Subcategory.belongsTo(Category, {
    onDelete: "CASCADE"
});

module.exports = { Category, Subcategory };