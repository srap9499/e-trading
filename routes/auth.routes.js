'use strict';

const { Router } = require('express');
const router = Router();

const Auth = require('../controllers/auth.controller');

router.get('/signUp', Auth.getSignUp);
router.post('/signUp', Auth.postSignUp);

router.get('/verify/:id', Auth.getVerify);
router.post('/verify', Auth.postVerify);

router.get('/signIn', Auth.getSignIn);
router.post('/signIn', Auth.postSignIn);

module.exports = router;