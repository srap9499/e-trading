'use strict';

require('dotenv').config();
const Env = process.env;

exports.development = {
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
    }
};