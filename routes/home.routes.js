'use strict';

const { Router } = require('express');
const router = Router();


const {
    USER_VIEWS: {
        HOME_VIEW
    },
    VIEW_TITLES: {
        USER_VIEW_TITLES: {
            HOME_TITLE
        }
    }
} = require('../constants/main.constant');


const Home = require('../controllers/home.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/** @description Route to Get Home Page */
router.get(
    '/',
    authenticate,
    Home.renderView(HOME_VIEW, HOME_TITLE)
);

/** @description Route to Get Products Data on Home Page */
router.get(
    '/products',
    authenticate,
    Home.getProductsData
);

module.exports = router;