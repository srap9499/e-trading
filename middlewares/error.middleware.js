'use strict';

const e = require("express");
const { sequelizeErrorFormatter } = require("../helpers/error-formatter.helper");

exports.error = ({ error, view, title="E-Trading"}, req, res, next) => {
    if (error.name === 'SequelizeValidationError') {
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
};
