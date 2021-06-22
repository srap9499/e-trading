'use strict';

const Sequelize = require('sequelize');
const { sequelize } = require('../config/db-connection.config');
const { User } = require('./user.model');

const Address = sequelize.define('address', {
    street: {
        type: Sequelize.STRING(128),
        allowNull: false,
        validate: {
            is: '/^.*$/'
        }
    },
    city: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            isAlpha: { msg: 'City is not valid!' }
        }
    },
    state: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            isAlpha: { msg: 'State is not valid!' }
        }
    },
    country: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            isAlpha: { msg: 'Country is not valid!' }
        }
    },
    zip_code: {
        type: Sequelize.STRING(15),
        allowNull: false,
        validate: {
            isAlphanumeric: { msg: 'Zip code is not valid!' }
        }
    }
}, {
    timestamps: false
});

User.hasOne(Address, {
    onDelete: 'CASCADE'
});
Address.belongsTo(User);

module.exports = { Address };