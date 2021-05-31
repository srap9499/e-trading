'use strict';

const { Router } = require("express");
const { addToCart } = require("../controllers/cart.controller");

const router = Router();

router.post('/add/:productId', addToCart);

module.exports = router;