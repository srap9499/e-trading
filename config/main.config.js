'use strict';

require('dotenv').config();
const Env = process.env;

const development = {
    DATABASE: {
        DATABASE_HOST: Env.DATABASE_HOST,
        DATABASE_NAME: Env.DATABASE_NAME,
        DATABASE_USER: Env.DATABASE_USER,
        DATABASE_PASSWORD: Env.DATABASE_PASSWORD,
        DATABASE_DIALECT: Env.DATABASE_DIALECT
    },
    FORCE_SYNC_FLAG: false,
    APP_PORT: Env.APP_PORT,
    INITIAL_WALLET_BONUS_AMOUNT: 500,
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
    MAILER: {
        MAIL_SERVICE: Env.MAIL_SERVICE,
        MAIL_USER: Env.MAIL_USER,
        MAIL_PASSWORD: Env.MAIL_PASSWORD,
        MAIL_SENDER: Env.MAIL_SENDER
    }
};

switch (Env.NODE_ENV) {
    case "development":
        module.exports = development;
        break;

    default:
        module.exports = development;
        break;
};