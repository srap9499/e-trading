'use strict';

const { Router } = require('express');
const router = Router();

const Auth = require('../controllers/auth.controller');
const { signUpSchema, verifySchema, signInSchema } = require('../helpers/validate.helper');
const { validate } = require('../middlewares/validate.middleware');

router.get('/signUp', Auth.getSignUp);
router.post(
    '/signUp', 
    validate(signUpSchema,{
        view: "signUp",
        title: "Sign Up"
    }), 
    Auth.postSignUp
);

router.get('/verify/:id', Auth.getVerify);
router.post(
    '/verify',
    validate(verifySchema, {
        view: "verify",
        title: "Verify Account"
    }),
    Auth.postVerify
);

router.get('/signIn', Auth.getSignIn);
router.post(
    '/signIn',
    validate(signInSchema, {
        view: "signIn",
        title: "Sign In"
    }),
    Auth.postSignIn
);

module.exports = router;