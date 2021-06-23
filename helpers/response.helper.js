'use strict';

exports.responseObj = (success= true, message, info={}) => {
    return {
        message: {
            type: success ? 'success' : 'error',
            body: message
        },
        data: success ? info : {},
        errors: success? {} : info
    };
};