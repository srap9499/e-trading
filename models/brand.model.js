'use strict';

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");


const Brand = sequelize.define("brand", {
    name: {
        type: Sequelize.STRING(40),
        alloWNull: false,
        unique: true,
    }
}, {
    paranoid: true,
    timestamps: false
});

module.exports = { Brand };