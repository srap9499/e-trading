'use strict';

const { Router } = require('express');
const router = Router();

const Auth = require('../controllers/auth.controller');
const { signUpSchema, verifySchema, signInSchema, changePasswordSchema } = require('../helpers/validate.helper');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate, validateRest } = require('../middlewares/validate.middleware');

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

router.get('/signOut', Auth.getSignOut);

router.put('/changepassword', authenticate, validateRest(changePasswordSchema), Auth.postChangePassword);

module.exports = router;