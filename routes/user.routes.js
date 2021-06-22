'use strict';

const { Router } = require("express");
const User = require("../controllers/user.controller");
const {
    addAmountSchema,
    changeUserDetailSchema,
    verifyChangeUserDetailSchema
} = require("../helpers/validate.helper");

const { validateRest } = require("../middlewares/validate.middleware");

const router = Router();

router.get('/cart', User.getCartPage);

router.get('/mycoupons', User.getMyCoupons);

/** @description Routes for Order History */
router.get('/orders', User.getOrderHistoryPage);

router.get('/orders/history', User.getOrderHistoryData);

router.get('/wallet', User.getWalletPage);

router.get('/wallet/amount', User.getWalletAmount);

router.post(
    '/wallet/addamount',
    validateRest(addAmountSchema),
    User.addAmount
);

router.get('/update', User.getUpdateUserPage);

router.get('/userdetails', User.getUserData);

router.put(
    '/update/userdetails',
    validateRest(changeUserDetailSchema),
    User.updateUserDetails
);

router.put(
    '/update/userdetails/verify',
    validateRest(verifyChangeUserDetailSchema),
    User.verifyUpdateUserDetails
);

module.exports = router;