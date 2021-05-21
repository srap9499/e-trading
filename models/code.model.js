'use strict';

const Sequelize = require('sequelize');

const { sequelize } = require('../config/db-connection.config');

const Code = sequelize.define('code', {
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    otp: {
        type: Sequelize.STRING(6),
        allowNull: false,
    }
}, {
    timestamps: false
});

exports.Code = Code;