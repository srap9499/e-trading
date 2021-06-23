'use strict';

const {
    development: {
        saltValue,
        userStatus,
        roles,
        Msgs
    }
} = require('../config/development.config');
const { hashSync } = require("bcryptjs");
const { UserRole } = require("../models/role.model");
const { User } = require("../models/user.model");
const { sequelize } = require('../config/db-connection.config');
const { responseObj } = require('../helpers/response.helper');


const getUserById = async (id) => {
    const user = await User.findByPk(id, {
        logging: false,
        attributes: [ 'id', 'userName', 'email' ],
        include: {
            model: UserRole,
            attributes: [ 'id', 'role' ]
        }
    });
    return user;
}

exports.renderView = (view= 'dashboard', title= 'E-Trading') => {
    view = `admin/${view}`;
    return async (req, res, next) => {
        const { id } = req.userData;
        try {
            const user = await getUserById(id);
            return res.status(200).render(view, {
                user,
                title
            });
        } catch (error) {
            return res.status(error.status).send({
                message: {
                    type: "error",
                    body: error.message
                }
            });
        }
    };
};

exports.addSubAdmin = async (req, res, next) => {
    const { userName, email, password } = req.body;
    try {
        await sequelize.transaction(async addTransaction => {
            const hashedPassword = hashSync(password, saltValue);
            const subAdminData = {
                userName,
                email,
                password: hashedPassword,
                status: userStatus.Active,
                userroleId: roles.SubAdmin
            };
            await User.create(subAdminData, {
                transaction: addTransaction
            });
        });
        return res.status(200).send(
            responseObj(true, Msgs.add200)
        );
    } catch (error) {
        console.log("API catch", error.name);
        next(error);
    }
}