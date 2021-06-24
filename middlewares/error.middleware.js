'use strict';

const {
    development: {
        errMsgs
    }
} = require('../config/development.config');
const createHttpError = require("http-errors");
const { sequelizeErrorFormatter } = require("../helpers/error-formatter.helper");
const { responseObj } = require("../helpers/response.helper");

exports.error = ({ error, view, title="E-Trading"}, req, res, next) => {
    if (error.name && error.name === 'SequelizeValidationError') {
        return res.status(400).render(view, {
            message: {
                type: "error",
                body: "Validation Errors!"
            },
            errors: sequelizeErrorFormatter(error),
            formData: req.body,
            title
        });
    }
    
    return res.status(500).render(view, {
        message: {
            type: "error",
            body: "Something went wrong!"
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
        case "SequelizeValidationError":
            res.status(400).send(
                responseObj(false, errMsgs.invalid400, sequelizeErrorFormatter(error))
            );
            break;
    
        default:
            const code = error.status??500;
            console.log(error.name, error.message);
            res.status(code).send(
                responseObj(false, code==500 ? errMsgs.err500 : error.message, error)
            );
            break;
    }
};