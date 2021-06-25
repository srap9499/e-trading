'use strict';

const {
    ERROR_MESSAGES: {
        EMAIL_IS_EMAIL_ERROR,
        EMAIL_LENGTH_ERROR
    }
} = require('../constants/main.constant');

const { NOW } = require('sequelize');
const Sequelize = require('sequelize');

const { sequelize } = require('../config/db-connection.config');

const Code = sequelize.define('code', {
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: EMAIL_IS_EMAIL_ERROR
            },
            len: {
                min: 5,
                max: 50,
                msg: EMAIL_LENGTH_ERROR
            }
        }
    },
    otp: {
        type: Sequelize.STRING(6),
        allowNull: false,
    }
}, {
    timestamps: false
});

const VerifyCode = sequelize.define('verifycode', {
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            isEmail: {
                msg: EMAIL_IS_EMAIL_ERROR
            },
            len: {
                min: 5,
                max: 50,
                msg: EMAIL_LENGTH_ERROR
            }
        }
    },
    otp: {
        type: Sequelize.STRING(6),
        allowNull: false,
    },
    for: {
        type: Sequelize.STRING(32),
        allowNull: false,
        defaultValue: 'account_activation'
    },
    status: {
        type: Sequelize.ENUM('used', 'unused'),
        allowNull: false,
        defaultValue: 'unused',
    },
    notAfter: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: NOW()
    }
}, {
    timestamps: false
});

module.exports= { Code, VerifyCode };