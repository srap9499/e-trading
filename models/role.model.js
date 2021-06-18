'use strict';

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");
const { development: { roles } } = require('../config/development.config');



const UserRole = sequelize.define('userrole', {
    role: {
        type: Sequelize.STRING(20),
        unique: true,
        allowNull: false
    }
}, {
    timestamps: false
});

UserRole.sync({ force: false, logging: false }).then(async () => {
    for (const [role, id] of Object.entries(roles)) {
        const isAlready = await UserRole.findOne({
            logging: false,
            where: {
                id,
                role
            }
        });
        if (!isAlready) {
            await UserRole.create({
                id,
                role
            }, {
                logging: false
            });
        }
    }
})

module.exports = { UserRole };