'use strict';

const Sequelize = require('sequelize');

// Sequelize connection
const { sequelize } = require('../config/db-connection.config');

const User = sequelize.define("User", {
    userName: {
        type: Sequelize.STRING(25),
        allowNull: false,
        validate: {
            is: /^[A-Za-z0-9]+$/,
            notNull: true
        }
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: false,
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    accessToken: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    paranoid: true
});

exports.User = User;