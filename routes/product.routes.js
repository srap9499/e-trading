'use strict';

const { Router } = require('express');
const router = Router();

const Product = require('../controllers/product.controller');

// route for Add product
router.post('/add', Product.postAddProduct);

// route for get all products
router.get('/all', Product.getAllProducts);

module.exports = router;