'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('./user.model');

const Wallet = sequelize.define('wallet', {
    amount: {
        type: Sequelize.DECIMAL(20,2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    paranoid: true
});

User.hasOne(Wallet, {
    onDelete: 'CASCADE'
});
Wallet.belongsTo(User);

module.exports = { Wallet };