'use strict';

const { Router } = require("express");
const User = require("../controllers/user.controller");
const { addAmountSchema } = require("../helpers/validate.helper");
const { authenticate } = require('../middlewares/auth.middleware');
const { validateRest } = require("../middlewares/validate.middleware");

const router = Router();

router.get('/mycart', authenticate, User.getMyCart);

router.get('/mycoupons', authenticate, User.getMyCoupons);

router.get('/orderhistory', authenticate, User.getOrderHistory);

router.get('/wallet', authenticate, User.getWalletPage);

router.get('/wallet/amount', authenticate, User.getWalletAmount);

router.post(
    '/wallet/addamount',
    authenticate,
    validateRest(addAmountSchema),
    User.addAmount
);

module.exports = router;