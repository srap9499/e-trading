'use strict';

const {
    DATABASE: {
        DATABASE_HOST,
        DATABASE_NAME,
        DATABASE_USER,
        DATABASE_PASSWORD,
        DATABASE_DIALECT
    }
} = require('./main.config');

const Sequelize = require('sequelize');

exports.sequelize = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    host: DATABASE_HOST,
    dialect: DATABASE_DIALECT
});