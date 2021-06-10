'use strict';

const { Router } = require('express');
const router = Router();

const Home = require('../controllers/home.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/** @description Route to Get Home Page */
router.get('/', authenticate, Home.getHomePage);

/** @description Route to Get Products Data on Home Page */
router.get('/products', authenticate, Home.getProductsData);

module.exports = router;