'use strict';

const {
    ERROR_MESSAGES: {
        VALIDATION_ERROR,
        DEFAULT_ERROR
    },
    VIEW_TITLES: {
        DEFAULT_TITLE
    }
} = require('../constants/main.constant');
const createHttpError = require("http-errors");
const { sequelizeErrorFormatter } = require("../helpers/error-formatter.helper");
const { responseObj } = require("../helpers/response.helper");

exports.error = ({ error, view, title = DEFAULT_TITLE }, req, res, next) => {
    if (error.name && error.name === 'SequelizeValidationError') {
        return res.status(400).render(view, {
            message: {
                type: "error",
                body: VALIDATION_ERROR
            },
            errors: sequelizeErrorFormatter(error),
            formData: req.body,
            title
        });
    }

    return res.status(500).render(view, {
        message: {
            type: "error",
            body: DEFAULT_ERROR
        },
        errors: {},
        formData: req.body,
        title
    });
};

exports.errorHandler = async (error, req, res, next) => {
    const isHttpError = createHttpError.isHttpError(error);
    if (isHttpError) {
        return res.status(error.status).send(responseObj(false, error.message));
    }
    switch (error.name) {
        case "SequelizeUniqueConstraintError":
        case "SequelizeValidationError":
            res.status(400).send(
                responseObj(false, VALIDATION_ERROR, sequelizeErrorFormatter(error))
            );
            break;

        default:
            const code = error.status ?? 500;
            console.log(error.name, error.message);
            res.status(code).send(
                responseObj(false, code == 500 ? DEFAULT_ERROR : error.message, error)
            );
            break;
    }
};