'use strict';

const { Router } = require("express");
const User = require("../controllers/user.controller");
const { addAmountSchema } = require("../helpers/validate.helper");
const { authenticate } = require('../middlewares/auth.middleware');
const { validateRest } = require("../middlewares/validate.middleware");

const router = Router();

router.get('/mycart', User.getMyCart);

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

module.exports = router;