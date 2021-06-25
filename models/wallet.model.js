'use strict';

const {
    ERROR_MESSAGES: {
        AMOUNT_ISDECIMAL_ERROR,
        AMOUNT_NOTNULL_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require('sequelize');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('./user.model');

const Wallet = sequelize.define('wallet', {
    amount: {
        type: Sequelize.DECIMAL(20,2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            isDecimal: { msg: AMOUNT_ISDECIMAL_ERROR },
            notNull: { msg: AMOUNT_NOTNULL_ERROR }
        }
    }
}, {
    paranoid: true
});

User.hasOne(Wallet, {
    onDelete: 'CASCADE'
});
Wallet.belongsTo(User);

module.exports = { Wallet };