'use strict';

const {
    ERROR_MESSAGES: {
        AMOUNT_NOTNULL_ERROR,
        AMOUNT_ISDECIMAL_ERROR,
        QUANTITY_NOTNULL_ERROR,
        QUANTITY_IS_INT_ERROR
    },
    ORDER_STATUS: {
        ORDER_STATUS_PENDING
    },
    ORDER_REMARKS: {
        PAYMENT_PENDING
    }
} = require('../constants/main.constant');

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");
const { User } = require('./user.model');
const { Coupon } = require('./coupon.model');
const { Product } = require('./product.model');

const Order = sequelize.define('order', {
    totalAmount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: AMOUNT_NOTNULL_ERROR
            },
            isDecimal: {
                msg: AMOUNT_ISDECIMAL_ERROR
            }
        }
    },
    discountedAmount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: AMOUNT_NOTNULL_ERROR
            },
            isDecimal: {
                msg: AMOUNT_ISDECIMAL_ERROR
            }
        }
    },
    status: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: ORDER_STATUS_PENDING
    },
    remark: {
        type: Sequelize.STRING(64),
        allowNull: true,
        defaultValue: PAYMENT_PENDING
    }
}, {
    timestamps: true,
    createdAt: false,
    updatedAt: 'date',
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
            notNull: {
                msg: QUANTITY_NOTNULL_ERROR
            },
            isInt: {
                msg: QUANTITY_IS_INT_ERROR
            }
        }
    },
    total: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            notNull: {
                msg: AMOUNT_NOTNULL_ERROR
            },
            isDecimal: {
                msg: AMOUNT_ISDECIMAL_ERROR
            }
        }
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