'use strict';

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");
const { User } = require('./user.model');
const { Coupon } = require('./coupon.model');
const { Product } = require('./product.model');

const Order = sequelize.define('order', {
    date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW()
    },
    totalAmount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    },
    discountedAmount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    },
    status: {
        type: Sequelize.ENUM("pending", "success", "failed"),
        allowNull: false,
        defaultValue: "pending"
    }
}, {
    timestamps: false,
    updatedAt: true,
    paranoid: true
});

User.hasMany(Order, {
    onDelete: 'CASCADE',
    allowNull: false
});
Order.belongsTo(User);

Coupon.hasOne(Order, {
    onDelete: 'SET NULL'
});
Order.belongsTo(Coupon);


const OrderDetail = sequelize.define('orderdetail', {
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            isInt: true
        }
    },
    total: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    timestamps: false
});

Order.hasMany(OrderDetail, {
    onDelete: 'CASCADE',
    allowNull: false
});
OrderDetail.belongsTo(Order);

Product.hasMany(OrderDetail, {
    onDelete: 'CASCADE',
    allowNull: false
});
OrderDetail.belongsTo(Product);

module.exports = { Order, OrderDetail };