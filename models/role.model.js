'use strict';

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");



const UserRole = sequelize.define('userrole', {
    role: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = { UserRole };