'use strict';

const Sequelize = require('sequelize');

// Sequelize connection
const { sequelize } = require('../config/db-connection.config');

const User = sequelize.define("user", {
    userName: {
        type: Sequelize.STRING(64),
        allowNull: false,
        validate: {
            isAlphanumeric: { msg: "User Name should be a valid alpha-numeric!"},
            len: {min: 2, max: 64, msg: "User Name length should between 2 and 64"
            },
        }
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: { msg: "Email already exists!"},
        validate: {
            isEmail: {msg: "Email should be a valid Email Id!"},
            len: { min:0, max: 50, msg: "Email is to long!"}
        }
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('active', 'pending'),
        allowNull: false,
        defaultValue: 'pending'
    },
    accessToken: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    paranoid: true
});

User.addHook('beforeCreate', 'avoidDuplicateEmail', async (user) => {
    const alreadyExists = await User.findOne({ where: { email: user.email } });
    if (alreadyExists) {
        throw new Sequelize.ValidationError("error", [
            {
                message: "Email Id already Exists!",
                path: "email",
                name: "SequelizeValidationError"
            }
        ]);
    }
});

exports.User = User;