'use strict';

const { Router } = require("express");
const User = require("../controllers/user.controller");
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/mycart', authenticate, User.getMyCart);

router.get('/mycoupons', authenticate, User.getMyCoupons);

router.get('/orderhistory', authenticate, User.getOrderHistory);

module.exports = router;