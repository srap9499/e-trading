'use strict';


const { Router } = require('express');

const {
    ADMIN_VIEWS: {
        DASHBOARD_VIEW,
        ADD_SUB_ADMIN_VIEW,
        SUB_ADMINS_VIEW,
        SUB_ADMINS_TRASH_VIEW,
        BRANDS_VIEW
    },
    VIEW_TITLES: {
        ADMIN_VIEW_TITLES: {
            DASHBOARD_TITLE,
            ADD_SUB_ADMIN_TITLE,
            SUB_ADMINS_TITLE,
            SUB_ADMINS_TRASH_TITLE,
            BRANDS_TITLE
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

/**
 * @description Route to render Sub Admins view
 * @method GET /admin/subadmins
 */
router.get(
    '/subadmins',
    [isSuperAdmin],
    Admin.renderView(SUB_ADMINS_VIEW, SUB_ADMINS_TITLE)
);

/**
 * @description Route to get all Sub Admins
 * @method GET /admin/subadmins/get
 */
router.get(
    '/subadmins/get',
    [isSuperAdmin],
    Admin.getSubAdmins
);

/**
 * @description Route to delete Sub Admins
 * @method DELETE /admin/subadmins/:id/delete
 */
router.delete(
    '/subadmin/:id/delete',
    [isSuperAdmin],
    Admin.destroySubAdmin
);

/**
 * @description Route to render Add Sub Admin view
 * @method GET /admin/subadmins/add
 */
router.get(
    '/subadmin/add',
    [isSuperAdmin],
    Admin.renderView(ADD_SUB_ADMIN_VIEW, ADD_SUB_ADMIN_TITLE)
);

/**
 * @description Route to Add Sub Admin
 * @method POST /admin/addsubadmin
 */
router.post(
    '/addsubadmin',
    [isSuperAdmin],
    validateRest(addSubAdminSchema, REQUEST_BODY),
    Admin.addSubAdmin
);

/**
 * @description Route to render Sub Admins Trash view
 * @method GET /admin/subadmins/trash
 */
router.get(
    '/subadmins/trash',
    [isSuperAdmin],
    Admin.renderView(SUB_ADMINS_TRASH_VIEW, SUB_ADMINS_TRASH_TITLE)
);

/**
 * @description Route to get Sub Admins Trash
 * @method GET /admin/subadmins/trash/get
 */
router.get(
    '/subadmins/trash/get',
    [isSuperAdmin],
    Admin.getSubAdminsTrash
);

/**
 * @description Route to restore soft deleted Sub Admin
 * @method PUT /admin/subadmin/:id/restore
 */
router.put(
    '/subadmin/:id/restore',
    [isSuperAdmin],
    Admin.restoreSubAdmin
);


/**
 * @description Route to render Brands view
 * @method GET /admin/brands
 */
router.get(
    '/brands',
    Admin.renderView(BRANDS_VIEW, BRANDS_TITLE)
);

/**
 * @description Route to get all Sub Admins
 * @method GET /admin/subadmins/get
 */
 router.get(
    '/brands/get',
    Admin.getBrands
);

/**
 * @description Route to delete Brand
 * @method DELETE /admin/brand/:id/delete
 */
 router.delete(
    '/brand/:id/delete',
    Admin.destroyBrand
);

module.exports = router;