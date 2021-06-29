'use strict';

const {
    ERROR_MESSAGES: {
        VALIDATION_ERROR
    },
    VIEW_PATH: {
        SHARED_VIEWS_PATH
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY
    }
} = require('../constants/main.constant');

const { joiErrorFormatter } = require("../helpers/error-formatter.helper");
const { responseObj } = require("../helpers/response.helper");

exports.validate = (schema, { target = REQUEST_BODY, view, title = "E-Trading" }) => {
    view = SHARED_VIEWS_PATH + view;
    return async (req, res, next) => {
        const validateResult = schema.validate(req[target], {
            abortEarly: false
        });
        if (!validateResult.error) {
            return next();
        }
        return res.status(400).render(view, {
            message: {
                type: "error",
                body: VALIDATION_ERROR
            },
            errors: joiErrorFormatter(validateResult.error),
            formData: req[target],
            title
        });
    };
};


exports.validateRest = (schema, target = REQUEST_BODY) => {
    return async (req, res, next) => {
        const validateResult = schema.validate(req[target], {
            abortEarly: false
        });
        if (!validateResult.error) {
            return next();
        }
        return res.status(400).send(
            responseObj(false, VALIDATION_ERROR, joiErrorFormatter(validateResult.error))
        );
    };
};