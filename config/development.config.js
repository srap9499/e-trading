'use strict';

require('dotenv').config();
const Env = process.env;

exports.development = {
    jwt_secret: Env.JWT_SECRET,
    saltValue: 12,
    roles: {
        SuperAdmin: 1,
        SubAdmin: 2,
        User: 3
    },
    userStatus: {
        Active: 'active',
        Pending: 'pending'
    },
    superAdminData: {
        userName: Env.SUPER_ADMIN_NAME,
        email: Env.SUPER_ADMIN_EMAIL,
        password: Env.SUPER_ADMIN_PASS
    },
    mailer: {
        MAIL_SERVICE: Env.MAIL_SERVICE,
        MAIL_USER: Env.MAIL_USER,
        MAIL_PASSWORD: Env.MAIL_PASSWORD,
        MAIL_SENDER: Env.MAIL_SENDER
    },
    errMsgs: {
        otp400: 'Incorrect OTP!',
        pw400: 'Incorrect Password!',
        invalid400: 'Validation Errors!',
        user404: 'User not found!',
        auth401: 'Unauthorized request!',
        err500: 'Something went wrong!'
    },
    Msgs: {
        add200: "Added successfully!",
        get200: "Data fetched successfully!",
        del200: "Deleted successfully!"
    }
};