'use strict';

const { hashSync } = require('bcryptjs');
// import jwt for token
const {
    sign
} = require('jsonwebtoken');
const { sequelize } = require('../config/db-connection.config');

// configure environment variables
const { 
    development: {
        jwt_secret,
        saltValue,
        roles,
        userStatus,
        superAdminData
    }
} = require('../config/development.config');
require('dotenv').config();

const { UserRole } = require('../models/role.model');
const { User } = require('../models/user.model');

exports.generateToken = (user, interval) => {
    const token = sign(user, jwt_secret, { expiresIn: interval });
    return token;
};

/**
 * @description Helper function to create UserRoles and SuperAdmin User at first
 */
exports.createSuper = async () => {
    console.log("hello");
    try {
        await sequelize.transaction(async createSuperTransaction => {
            for (const [role, id] of Object.entries(roles)) {
                const isAlready = await UserRole.findOne({
                    logging: false,
                    where: {
                        id,
                        role
                    },
                    transaction: createSuperTransaction
                });
                if (!isAlready) {
                    await UserRole.create({
                        id,
                        role
                    }, {
                        logging: false,
                        transaction: createSuperTransaction
                    });
                }
            }
            const { userName, email, password } = superAdminData;
            const hashedPassword = hashSync(password, saltValue);
            const adminData = {
                userName,
                email,
                password: hashedPassword,
                status: userStatus.Active,
                userroleId: roles.SuperAdmin
            };
            await User.create(adminData, {
                logging: false,
                transaction: createSuperTransaction
            });
        });
        console.log("success");
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};