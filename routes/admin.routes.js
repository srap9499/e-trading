'use strict';


const { Router } = require('express');

const {
    ADMIN_VIEWS: {
        DASHBOARD_VIEW,
        ADD_SUB_ADMIN_VIEW,
        SUB_ADMINS_VIEW
    },
    VIEW_TITLES: {
        ADMIN_VIEW_TITLES: {
            DASHBOARD_TITLE,
            ADD_SUB_ADMIN_TITLE,
            SUB_ADMINS_TITLE
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY
    }
} = require('../constants/main.constant');

const Admin = require('../controllers/admin.controller');
const { addSubAdminSchema } = require('../helpers/validate.helper');
const { isSuperAdmin } = require('../middlewares/auth.middleware');
const { validateRest } = require('../middlewares/validate.middleware');


const router = Router();

router.get('/', Admin.renderView(DASHBOARD_VIEW, DASHBOARD_TITLE));

router.get(
    '/subadmins',
    [isSuperAdmin],
    Admin.renderView(SUB_ADMINS_VIEW, SUB_ADMINS_TITLE)
);

router.get(
    '/subadmins/get',
    [isSuperAdmin],
    Admin.getSubAdmins
);

router.delete(
    '/subadmin/:id/delete',
    [isSuperAdmin],
    Admin.destroySubAdmin
);

router.get(
    '/subadmin/add',
    [isSuperAdmin],
    Admin.renderView(ADD_SUB_ADMIN_VIEW, ADD_SUB_ADMIN_TITLE)
);

router.post(
    '/addsubadmin',
    [isSuperAdmin],
    validateRest(addSubAdminSchema, REQUEST_BODY),
    Admin.addSubAdmin
);

module.exports = router;