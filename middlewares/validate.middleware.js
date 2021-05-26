'use strict';

const { joiErrorFormatter } = require("../helpers/error-formatter.helper");

exports.validate = (schema , { target="body", view, title="E-Trading"}) => {
    target = target.toLocaleLowerCase();
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
                body: "Validation Errors"
            },
            errors: joiErrorFormatter(validateResult.error),
            formData: req[target],
            title
        });
    };
};