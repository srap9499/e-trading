'use strict';

const { Router } = require('express');
const router = Router();

const {
    VIEW_TITLES: {
        SHARED_VIEW_TITLES: {
            SIGN_UP_TITLE,
            SIGN_IN_TITLE,
            VERIFY_ACCOUNT_TITLE
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY
    }
} = require('../constants/main.constant');

const Auth = require('../controllers/auth.controller');
const { signUpSchema, verifySchema, signInSchema, changePasswordSchema } = require('../helpers/validate.helper');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate, validateRest } = require('../middlewares/validate.middleware');

router.get('/signUp', Auth.getSignUp);
router.post(
    '/signUp', 
    validate(signUpSchema,{
        view: "signUp",
        title: SIGN_UP_TITLE
    }), 
    Auth.postSignUp
);

router.get('/verify/:id', Auth.getVerify);
router.post(
    '/verify',
    validate(verifySchema, {
        view: "verify",
        title: VERIFY_ACCOUNT_TITLE
    }),
    Auth.postVerify
);

router.get('/signIn', Auth.getSignIn);
router.post(
    '/signIn',
    validate(signInSchema, {
        view: "signIn",
        title: SIGN_IN_TITLE
    }),
    Auth.postSignIn
);

router.get('/signOut', Auth.getSignOut);

router.put(
    '/changepassword',
    [authenticate],
    validateRest(changePasswordSchema, REQUEST_BODY),
    Auth.postChangePassword
);

module.exports = router;