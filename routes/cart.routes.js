'use strict';

const { Router } = require("express");
const Cart = require("../controllers/cart.controller");

const router = Router();

router.post('/add/:productId', Cart.addToCart);

router.post('/update/:productId', Cart.updateCart);

router.get('/checkout', Cart.checkOut);

router.get('/checkout/:orderId/status', Cart.getOrderStatus);

router.post('/checkout/:orderId/payment', Cart.payment, Cart.generateInvoice);

router.get('/checkout/:orderId/cancel', Cart.cancelOrder);

router.get('/checkout/:orderId/retry', Cart.retryOrder);

module.exports = router;