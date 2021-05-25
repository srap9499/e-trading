'use strict';

const joiErrorFormatter = (rowErrors) => {
    const errors = {};
    const details = rowErrors.details;
    details.map(d => {
        errors[d.path] = d.message;
    });
    return errors;
};

const sequelizeErrorFormatter = (rowErrors) => {
    const errors = {};
    rowErrors.errors.map(e => {
        errors[e.path] = e.message;
    });
    
    return errors;
}

module.exports = {
    joiErrorFormatter,
    sequelizeErrorFormatter
};