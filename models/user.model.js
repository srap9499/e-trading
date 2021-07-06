'use strict';

const {
    ERROR_MESSAGES: {
        USER_NAME_IS_ALPHANUMERIC_ERROR,
        USER_NAME_LENGTH_ERROR,
        EMAIL_UNIQUE_ERROR,
        EMAIL_IS_EMAIL_ERROR,
        EMAIL_LENGTH_ERROR,
        PASSWORD_NOTNULL_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require('sequelize');

// Sequelize connection
const { sequelize } = require('../config/db-connection.config');
const { UserRole } = require('./role.model');
const { userStatus } = require('../config/main.config');

const User = sequelize.define("user", {
    userName: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            isAlphanumeric: {
                msg: USER_NAME_IS_ALPHANUMERIC_ERROR
            },
            len: {
                min: 2, 
                max: 64,
                msg: USER_NAME_LENGTH_ERROR
            },
        }
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: { 
            msg: EMAIL_UNIQUE_ERROR
        },
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
    password: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            notNull: {
                msg: PASSWORD_NOTNULL_ERROR
            }
        }
    },
    status: {
        type: Sequelize.STRING(15),
        allowNull: false,
        defaultValue: userStatus.Pending
    },
    accessToken: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    paranoid: true
});

User.addHook('beforeCreate', 'avoidDuplicateEmail', async (user) => {
    const alreadyExists = await User.findOne({
        logging: false,
        where: {
            email: user.email
        }
    });
    if (alreadyExists) {
        throw new Sequelize.ValidationError("error", [
            {
                message: EMAIL_UNIQUE_ERROR,
                path: "email",
                name: "SequelizeValidationError"
            }
        ]);
    }
});

UserRole.hasMany(User, {
    allowNull: false,
    onDelete: 'SET NULL'
});
User.belongsTo(UserRole);

module.exports = { User };