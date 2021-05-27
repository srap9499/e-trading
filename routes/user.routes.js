'use strict';

const { Router } = require("express");
const { getCart, getMyCart } = require("../controllers/user.controller");
const { authenticate } = require('../middlewares/auth.middleware');

const router = Router();

router.get('/mycart', authenticate, getMyCart);

module.exports = router;