'use strict';


const { Router } = require('express');

const {
    ADMIN_VIEWS: {
        DASHBOARD_VIEW,
        ADD_SUB_ADMIN_VIEW,
        EDIT_SUB_ADMIN_VIEW,
        SUB_ADMINS_VIEW,
        SUB_ADMINS_TRASH_VIEW,
        BRANDS_VIEW,
        BRANDS_TRASH_VIEW,
        ADD_BRAND_VIEW,
        EDIT_BRAND_VIEW,
        PRODUCTS_VIEW,
        PRODUCTS_TRASH_VIEW,
        ADD_PRODUCT_VIEW,
        ADD_BULK_PRODUCT_VIEW,
        EDIT_PRODUCT_VIEW,
        CATEGORIES_VIEW,
        CATEGORIES_TRASH_VIEW,
        ADD_CATEGORY_VIEW,
        EDIT_CATEGORY_VIEW,
        EDIT_SUB_CATEGORY_VIEW,
        IN_DELIVERY_ORDERS_VIEW,
        VERIFY_MARK_DELIVERY_VIEW,
        EDIT_PROFILE_VIEW,
        CHANGE_PASSWORD_VIEW
    },
    VIEW_TITLES: {
        ADMIN_VIEW_TITLES: {
            DASHBOARD_TITLE,
            ADD_SUB_ADMIN_TITLE,
            EDIT_SUB_ADMIN_TITLE,
            SUB_ADMINS_TITLE,
            SUB_ADMINS_TRASH_TITLE,
            BRANDS_TITLE,
            BRANDS_TRASH_TITLE,
            ADD_BRAND_TITLE,
            EDIT_BRAND_TITLE,
            PRODUCTS_TITLE,
            PRODUCTS_TRASH_TITLE,
            ADD_PRODUCT_TITLE,
            ADD_BULK_PRODUCT_TITLE,
            EDIT_PRODUCT_TITLE,
            CATEGORIES_TITLE,
            CATEGORIES_TRASH_TITLE,
            ADD_CATEGORY_TITLE,
            EDIT_CATEGORY_TITLE,
            EDIT_SUB_CATEGORY_TITLE,
            IN_DELIVERY_ORDERS_TITLE,
            VERIFY_MARK_DELIVERY_TITLE,
            EDIT_PROFILE_TITLE,
            CHANGE_PASSWORD_TITLE
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY,
    }
} = require('../constants/main.constant');

const Admin = require('../controllers/admin.controller');

const {
    addSubAdminSchema,
    addBrandSchema,
    addCategorySchema,
    addSubCategorySchema,
    addProductSchema,
    editProductSchema,
    editBrandSchema,
    editCategorySchema,
    editSubCategorySchema,
    editProfileSchema,
    editSubAdminProfileSchema,
    editSubAdminPasswordSchema,
    verifyMarkDeliverySchema
} = require('../helpers/validate.helper');

const { isSuperAdmin } = require('../middlewares/auth.middleware');
const Edit = require('../middlewares/edit.middleware');
const {
    upload_product_image,
    upload_add_bulk_file
} = require('../middlewares/file-upload.middleware');
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
 * @description Route to render Edit Sub Admin view
 * @method GET /admin/subadmin/:id/edit
 */
router.get(
    '/subadmin/:id/edit',
    [
        isSuperAdmin,
        Edit.createSubadminCookie,
    ],
    Admin.renderView(EDIT_SUB_ADMIN_VIEW, EDIT_SUB_ADMIN_TITLE)
);

/**
 * @description Route to get Sub Admin details by Id
 * @method GET /admin/subadmin/edit/getdetails
 */
router.get(
    '/subadmin/edit/getdetails',
    [
        isSuperAdmin,
        Edit.getSubadminCookie,
    ],
    Admin.getSubAdminById
);

/**
 * @description Router to edit Sub Admin Profile
 * @method PUT /admin/subadmin/:id/edit/profile
 */
router.put(
    '/subadmin/:id/edit/profile',
    [
        isSuperAdmin,
        validateRest(editSubAdminProfileSchema, REQUEST_BODY),
    ],
    Admin.editSubAdminProfile
);

/**
 * @description Route to edit Sub Admin Password
 * @method PUT /admin/subadmin/:id/edit/password
 */
router.put(
    '/subadmin/:id/edit/password',
    [
        isSuperAdmin,
        validateRest(editSubAdminPasswordSchema, REQUEST_BODY),
    ],
    Admin.editSubAdminPassword
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

/**
 * @description Route to render Brands Trash view
 * @method GET /admin/brands/trash
 */
 router.get(
    '/brands/trash',
    Admin.renderView(BRANDS_TRASH_VIEW, BRANDS_TRASH_TITLE)
);

/**
 * @description Route to get Brands Trash
 * @method GET /admin/brands/trash/get
 */
router.get(
    '/brands/trash/get',
    Admin.getBrandsTrash
);

/**
 * @description Route to restore soft deleted Brand
 * @method PUT /admin/brand/:id/restore
 */
router.put(
    '/brand/:id/restore',
    Admin.restoreBrand
);

/**
 * @description Route to render Add Brand view
 * @method GET /admin/brand/add
 */
 router.get(
    '/brand/add',
    Admin.renderView(ADD_BRAND_VIEW, ADD_BRAND_TITLE)
);

/**
 * @description Route to Add Brand
 * @method POST /admin/brand/add
 */
router.post(
    '/brand/add',
    validateRest(addBrandSchema, REQUEST_BODY),
    Admin.addBrand
);

/**
 * @description Route to Add Bulk Brand By CSV file
 * @method POST /admin/brand/add/bulk
 */
router.post(
    '/brand/add/bulk',
    [
        upload_add_bulk_file.single('bulk_brand'),
    ],
    Admin.addBulkBrandByCSV
);

/**
 * @description Route to render Edit Brand View
 * @method GET /admin/brand/:id/edit
 */
router.get(
    '/brand/:id/edit',
    Edit.createBrandCookie,
    Admin.renderView(EDIT_BRAND_VIEW, EDIT_BRAND_TITLE)
);

/**
 * @description Route to get edit brand details by brand Id (req.params = {id})
 * @method GET /admin/brand/edit/getdetails
 */
router.get(
    '/brand/edit/getdetails',
    Edit.getBrandCookie,
    Admin.getBrandById
);

/**
 * @description Route to edit Brand
 * @method PUT /admin/brand/:id/edit
 */
router.put(
    '/brand/:id/edit',
    validateRest(editBrandSchema, REQUEST_BODY),
    Admin.editBrand
);

/**
 * @description Route to render Categories view
 * @method GET /admin/categories
 */
 router.get(
    '/categories',
    Admin.renderView(CATEGORIES_VIEW, CATEGORIES_TITLE)
);

/**
 * @description Route to get Categories
 * @method GET /admin/categories/get
 */
router.get(
    '/categories/get',
    Admin.getCategories
);

/**
 * @description Route to delete Category
 * @method DELETE /admin/category/:id/delete
 */
router.delete(
    '/category/:id/delete',
    Admin.destroyCategory
);

/**
 * @description Route to delete Sub Category
 * @method DELETE /admin/subcategory/:id/delete
 */
router.delete(
    '/subcategory/:id/delete',
    Admin.destroySubCategory
);

/**
 * @description Route to render Categories Trash view
 * @method GET /admin/categories/trash
 */
 router.get(
    '/categories/trash',
    Admin.renderView(CATEGORIES_TRASH_VIEW, CATEGORIES_TRASH_TITLE)
);

/**
 * @description Route to get Categories Trash
 * @method GET /admin/categories/trash/get
 */
router.get(
    '/categories/trash/get',
    Admin.getCategoriesTrash
);

/**
 * @description Route to get sub Categories Trash
 * @method GET /admin/subcategories/trash/get
 */
router.get(
    '/subcategories/trash/get',
    Admin.getSubCategoriesTrash
);

/**
 * @description Route to restore soft deleted Category
 * @method PUT /admin/category/:id/restore
 */
router.put(
    '/category/:id/restore',
    Admin.restoreCategory
);

/**
 * @description Route to restore soft deleted Sub Category
 * @method PUT /admin/subcategory/:id/restore
 */
router.put(
    '/subcategory/:id/restore',
    Admin.restoreSubCategory
);

/**
 * @description Route to Add Bulk Category By CSV file
 * @method POST /admin/category/add/bulk
 */
router.post(
    '/category/add/bulk',
    [
        upload_add_bulk_file.single('bulk_category')
    ],
    Admin.addBulkCategoryByCSV
);

/**
 * @description Route to render Add Category view
 * @method GET /admin/category/add
 */
router.get(
    '/category/add',
    Admin.renderView(ADD_CATEGORY_VIEW, ADD_CATEGORY_TITLE)
);

/**
 * @description Route to Add Category,
 * @method POST /admin/category/add
 */
router.post(
    '/category/add',
    validateRest(addCategorySchema, REQUEST_BODY),
    Admin.addCategory
);

/**
 * @description Route to render Edit Category View
 * @method GET /admin/category/:id/edit
 */
router.get(
    '/category/:id/edit',
    Edit.createCategoryCookie,
    Admin.renderView(EDIT_CATEGORY_VIEW, EDIT_CATEGORY_TITLE)
);

/**
 * @description Route to get edit category details by category Id (req.params = {id})
 * @method GET /admin/category/edit/getdetails
 */
router.get(
    '/category/edit/getdetails',
    Edit.getCategoryCookie,
    Admin.getCategoryById
);

/**
 * @description Route to edit Category
 * @method PUT /admin/category/:id/edit
 */
router.put(
    '/category/:id/edit',
    validateRest(editCategorySchema, REQUEST_BODY),
    Admin.editCategory
);

/**
 * @description Route to get Previous Selected Category for Add Sub Category
 * @method GET /admin/subcategory/previous/category
 */
router.get(
    '/subcategory/previous/category',
    Admin.getSubcategory_previousSelectedCategory
);

/**
 * @description Route to get category list 
 * @method GET /admin/categories/list
 */
router.get(
    '/categories/list',
    Admin.getCategoryList
);

/**
 * @description Route to Add Sub Category,
 * @method POST /admin/subcategory/add
 */
router.post(
    '/subcategory/add',
    validateRest(addSubCategorySchema, REQUEST_BODY),
    Admin.addSubCategory
);

/**
 * @description Route to render Edit Sub Category View
 * @method GET /admin/subcategory/:id/edit
 */
router.get(
    '/subcategory/:id/edit',
    Edit.createSubCategoryCookie,
    Admin.renderView(EDIT_SUB_CATEGORY_VIEW, EDIT_SUB_CATEGORY_TITLE)
);

/**
 * @description Route to get edit subcategory details by subcategory Id (req.params = {id})
 * @method GET /admin/subcategory/edit/getdetails
 */
router.get(
    '/subcategory/edit/getdetails',
    Edit.getSubCategoryCookie,
    Admin.getSubCategoryById
);

/**
 * @description Route to edit Sub Category
 * @method PUT /admin/subcategory/:id/edit
 */
router.put(
    '/subcategory/:id/edit',
    validateRest(editSubCategorySchema, REQUEST_BODY),
    Admin.editSubCategory
);

/**
 * @description Route to get subcategory list by categoryId
 * @method GET /admin/categories/:categoryId/subcategories/list
 */
router.get(
    '/categories/:categoryId/subcategories/list',
    Admin.getSubCategoryListByCategoryId
);

/**
 * @description Route to get Previous Selected Brand for Add Product
 * @method GET /admin/product/previous/brand
 */
router.get(
    '/product/previous/brand',
    Admin.getProduct_previousSelectedBrand
);

/**
 * @description Route to get Previous Selected Category for Add Product
 * @method GET /admin/product/previous/category
 */
router.get(
    '/product/previous/category',
    Admin.getProduct_previousSelectedCategory
);

/**
 * @description Route to get Previous Selected Sub Category by categoryId for Add Product
 * @method GET /admin/product/:categoryId/previous/subcategory
 */
router.get(
    '/product/:categoryId/previous/subcategory',
    Admin.getProduct_previousSelectedSubcategory
);

/**
 * @description Route to get brand list 
 * @method GET /admin/brands/list
 */
router.get(
    '/brands/list',
    Admin.getBrandList
);

/**
 * @description Route to render All Products view
 * @method GET /admin/products
 */
 router.get(
    '/products',
    Admin.renderView(PRODUCTS_VIEW, PRODUCTS_TITLE)
);

/**
 * @description Route to get All Products
 * @method GET /admin/products/get
 */
router.get(
    '/products/get',
    Admin.getProducts
);

/**
 * @description Route to delete Product
 * @method DELETE /admin/product/:id/delete
 */
 router.delete(
    '/product/:id/delete',
    Admin.destroyProduct
);

/**
 * @description Route to render Products Trash view
 * @method GET /admin/products/trash
 */
 router.get(
    '/products/trash',
    Admin.renderView(PRODUCTS_TRASH_VIEW, PRODUCTS_TRASH_TITLE)
);

/**
 * @description Route to get Products Trash
 * @method GET /admin/products/trash/get
 */
router.get(
    '/products/trash/get',
    Admin.getProductsTrash
);

/**
 * @description Route to restore soft deleted Product
 * @method PUT /admin/product/:id/restore
 */
router.put(
    '/product/:id/restore',
    Admin.restoreProduct
);

/**
 * @description Route to render Add Product view
 * @method GET /admin/product/add
 */
router.get(
    '/product/add',
    Admin.renderView(ADD_PRODUCT_VIEW, ADD_PRODUCT_TITLE)
);

/**
 * @description Route to Add Product
 * @method POST /admin/product/add
 */
router.post(
    '/product/add',
    [
        upload_product_image.single('product_image'),
        validateRest(addProductSchema, REQUEST_BODY)
    ],
    Admin.addProduct
);

/**
 * @description Route to render Add Bulk Product using CSV view
 * @method GET /admin/product/add/bulk
 */
router.get(
    '/product/add/bulk',
    Admin.renderView(ADD_BULK_PRODUCT_VIEW, ADD_BULK_PRODUCT_TITLE)
);

/**
 * @description Route to Add Bulk Product using CSV file
 * @method POST /admin/product/add/bulk
 */
router.post(
    '/product/add/bulk',
    [
        upload_add_bulk_file.single('bulk_product'),
    ],
    Admin.addBulkProductByCSV
);

/**
 * @description Route to render Edit Product View
 * @method GET /admin/product/:id/edit
 */
router.get(
    '/product/:id/edit',
    Edit.createProductCookie,
    Admin.renderView(EDIT_PRODUCT_VIEW, EDIT_PRODUCT_TITLE)
);

/**
 * @description Route to get edit product details by product Id (req.params = {id})
 * @method GET /admin/product/edit/getdetails
 */
router.get(
    '/product/edit/getdetails',
    Edit.getProductCookie,
    Admin.getProductById
);

/**
 * @description Route to edit Product
 * @method PUT /admin/product/:id/edit
 */
router.put(
    '/product/:id/edit',
    [
        upload_product_image.single('product_image'),
        validateRest(editProductSchema, REQUEST_BODY),
    ],
    Admin.editProduct
);

/**
 * @description Route to render In Delivery Orders view
 * @method GET /admin/orders/indelivery
 */
router.get(
    '/orders/indelivery',
    Admin.renderView(IN_DELIVERY_ORDERS_VIEW, IN_DELIVERY_ORDERS_TITLE)
);

/**
 * @description Route to get Orders
 * @method GET /admin/orders/get
 */
router.get(
    '/orders/get',
    Admin.getOrders
);

/**
 * @description Route to process for mark order delivery
 * @method GET /admin/order/:id/markdelivery
 */
router.get(
    '/order/:id/markdelivery',
    [
        Edit.createOrderCookie
    ],
    Admin.processMarkDelivery,
    Admin.renderView(VERIFY_MARK_DELIVERY_VIEW, VERIFY_MARK_DELIVERY_TITLE)
);

router.get(
    '/order/markdelivery/getdetails',
    [
        Edit.getOrderCookie,
    ],
    Admin.getMarkDeliveryDetailsById
);

router.put(
    '/order/:id/markdelivery',
    [
        validateRest(verifyMarkDeliverySchema, REQUEST_BODY)
    ],
    Admin.verifyMarkDelivery
);

/**
 * @description Route to render Edit Profile view
 * @method GET /admin/profile/edit
 */
router.get(
    '/profile/edit',
    Admin.renderView(EDIT_PROFILE_VIEW, EDIT_PROFILE_TITLE)
);

/**
 * @description Route to get Profile Details
 * @method GET /admin/profile/get
 */
router.get(
    '/profile/get',
    Admin.getProfileDetails
);

/**
 * @description Route to Edit Profile
 * @method PUT /admin/profile/edit
 */
router.put(
    '/profile/edit',
    [
        validateRest(editProfileSchema, REQUEST_BODY),
    ],
    Admin.editProfile
);

/**
 * @description Route to render Change Password view
 * @method GET /admin/password/change
 */
router.get(
    '/password/change',
    Admin.renderView(CHANGE_PASSWORD_VIEW, CHANGE_PASSWORD_TITLE)
);

module.exports = router;