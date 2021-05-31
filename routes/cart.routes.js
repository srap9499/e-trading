'use strict';

const { Router } = require("express");
const Cart = require("../controllers/cart.controller");

const router = Router();

router.post('/add/:productId', Cart.addToCart);

router.post('/update/:productId', Cart.updateCart);

module.exports = router;