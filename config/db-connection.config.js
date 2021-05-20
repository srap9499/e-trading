'use strict';

require('dotenv').config();
const {
    HOST,
    DB_NAME,
    DB_USER,
    DB_PW,
    DIALECT
} = process.env;

const Sequelize = require('sequelize');

exports.sequelize = new Sequelize(DB_NAME, DB_USER, DB_PW, {
    host: HOST,
    dialect: DIALECT
});