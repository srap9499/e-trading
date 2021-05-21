'use strict';

const { Router } = require('express');
const router = Router();

const Home = require('../controllers/home.controller');
const { authenticate } = require('../middlewares/auth.middleware');

router.get('/', authenticate, Home.getHome);

module.exports = router;