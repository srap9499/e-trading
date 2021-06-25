'use strict';

const { Router } = require("express");
const User = require("../controllers/user.controller");

const {
    USER_VIEWS: {
        CART_VIEW,
        WALLET_VIEW,
        ORDER_HISTORY_VIEW,
        UPDATE_PROFILE_VIEW
    },
    VIEW_TITLES: {
        USER_VIEW_TITLES: {
            CART_TITLE,
            WALLET_TITLE,
            ORDER_HISTORY_TITLE,
            UPDATE_PROFILE_TITLE
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY
    }
} = require('../constants/main.constant');

const {
    addAmountSchema,
    changeUserDetailSchema,
    verifyChangeUserDetailSchema
} = require("../helpers/validate.helper");

const { validateRest } = require("../middlewares/validate.middleware");

const router = Router();

router.get(
    '/cart',
    User.renderView(CART_VIEW, CART_TITLE)
);

router.get(
    '/mycoupons',
    User.getMyCoupons
);

/** @description Routes for Order History */
router.get(
    '/orders',
    User.renderView(ORDER_HISTORY_VIEW, ORDER_HISTORY_TITLE)
);

router.get(
    '/orders/history',
    User.getOrderHistoryData
);

router.get(
    '/wallet',
    User.renderView(WALLET_VIEW, WALLET_TITLE)
);

router.get(
    '/wallet/amount',
    User.getWalletAmount
);

router.post(
    '/wallet/addamount',
    validateRest(addAmountSchema, REQUEST_BODY),
    User.addAmount
);

router.get(
    '/update',
    User.renderView(UPDATE_PROFILE_VIEW, UPDATE_PROFILE_TITLE)
);

router.get(
    '/userdetails',
    User.getUserData
);

router.put(
    '/update/userdetails',
    validateRest(changeUserDetailSchema, REQUEST_BODY),
    User.updateUserDetails
);

router.put(
    '/update/userdetails/verify',
    validateRest(verifyChangeUserDetailSchema, REQUEST_BODY),
    User.verifyUpdateUserDetails
);

module.exports = router;