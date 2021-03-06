'use strict';

const {
    ERROR_MESSAGES: {
        BRAND_NOTNULL_EMPTY_ERROR,
        BRAND_LENGTH_ERROR,
        BRAND_UNIQUE_ERROR,
        VALIDATION_ERROR
    }
} = require('../constants/main.constant');

const Sequelize = require("sequelize");
const { sequelize } = require("../config/db-connection.config");


const Brand = sequelize.define("brand", {
    name: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: {
            msg: BRAND_UNIQUE_ERROR
        },
        validate: {
            notNull: {
                msg: BRAND_NOTNULL_EMPTY_ERROR
            },
            notEmpty: {
                msg: BRAND_NOTNULL_EMPTY_ERROR
            },
            len: {
                min: 2,
                max: 40,
                msg: BRAND_LENGTH_ERROR
            }
        }
    }
}, {
    createdAt: false,
    updatedAt: false,
    paranoid: true,
    hooks: {
        beforeCreate: async brand => {
            const brandExists = await Brand.findOne({
                logging: false,
                where: {
                    name: brand.name
                }
            });
            if (brandExists) {
                throw new Sequelize.ValidationError(VALIDATION_ERROR, [
                    {
                        message: BRAND_UNIQUE_ERROR,
                        path: "name"
                    }
                ]);
            }
        }
    }
});

module.exports = { Brand };