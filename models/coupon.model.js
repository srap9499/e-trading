'use strict';

const { NOW } = require("sequelize");
const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");
const { User } = require("./user.model");

const Coupon = sequelize.define('coupon', {
    name: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    code: {
        type: Sequelize.STRING(6),
        allowNull: false
    },
    type: {
        type: Sequelize.ENUM("dynamic", "static"),
        allowNull: false,
        defaultValue: "static"
    },
    value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: Sequelize.ENUM("unused", "used"),
        allowNull: false,
        defaultValue: "unused"
    },
    notAfter: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: NOW()
    }
}, {
    timestamps: false,
    paranoid: true
});

User.hasMany(Coupon, {
    onDelete: 'CASCADE'
});
Coupon.belongsTo(User);

module.exports = { Coupon };