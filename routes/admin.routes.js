'use strict';


const { Router } = require('express');

const Admin = require('../controllers/admin.controller');
const { addSubAdminSchema } = require('../helpers/validate.helper');
const { isSuperAdmin } = require('../middlewares/auth.middleware');
const { validateRest } = require('../middlewares/validate.middleware');


const router = Router();

router.get('/', Admin.renderView());

router.get(
    '/subadmins',
    [isSuperAdmin],
    Admin.renderView('sub-admins', 'E-Trading - Sub Admins')
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
    Admin.renderView('add-sub-admin', 'E-Trading - Add Sub Admin')
);

router.post(
    '/addsubadmin',
    [isSuperAdmin],
    validateRest(addSubAdminSchema),
    Admin.addSubAdmin
);

module.exports = router;