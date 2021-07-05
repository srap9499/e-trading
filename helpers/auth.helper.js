'use strict';

const { hashSync } = require('bcryptjs');
// import jwt for token
const {
    sign,
    verify
} = require('jsonwebtoken');
const { sequelize } = require('../config/db-connection.config');

// configure environment variables
const {
    jwt_secret,
    saltValue,
    roles,
    userStatus,
    superAdminData
} = require('../config/main.config');

const { UserRole } = require('../models/role.model');
const { User } = require('../models/user.model');

exports.generateToken = (data, interval) => {
    const token = sign(data, jwt_secret, { expiresIn: interval });
    return token;
};


exports.verifyToken = token => {
    return new Promise((resolve, reject) => {
        verify(token, jwt_secret, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

/**
 * @description Helper function to create UserRoles and SuperAdmin User at first
 */
exports.createSuper = async () => {
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
        return Promise.resolve();
    } catch (error) {
        console.log(error);
        return Promise.reject(error);
    }
};