'use strict';


const { Router } = require('express');

const {
    ADMIN_VIEWS: {
        DASHBOARD_VIEW,
        ADD_SUB_ADMIN_VIEW,
        SUB_ADMINS_VIEW,
        SUB_ADMINS_TRASH_VIEW,
        BRANDS_VIEW,
        BRANDS_TRASH_VIEW,
        ADD_BRAND_VIEW,
        PRODUCTS_VIEW,
        PRODUCTS_TRASH_VIEW,
        ADD_PRODUCT_VIEW,
        CATEGORIES_VIEW,
        CATEGORIES_TRASH_VIEW,
        ADD_CATEGORY_VIEW,
        CHANGE_PASSWORD_VIEW
    },
    VIEW_TITLES: {
        ADMIN_VIEW_TITLES: {
            DASHBOARD_TITLE,
            ADD_SUB_ADMIN_TITLE,
            SUB_ADMINS_TITLE,
            SUB_ADMINS_TRASH_TITLE,
            BRANDS_TITLE,
            BRANDS_TRASH_TITLE,
            ADD_BRAND_TITLE,
            PRODUCTS_TITLE,
            PRODUCTS_TRASH_TITLE,
            ADD_PRODUCT_TITLE,
            CATEGORIES_TITLE,
            CATEGORIES_TRASH_TITLE,
            ADD_CATEGORY_TITLE,
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
    addProductSchema
} = require('../helpers/validate.helper');

const { isSuperAdmin } = require('../middlewares/auth.middleware');
const { upload_product_image } = require('../middlewares/file-upload.middleware');
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

router.post(
    '/product/add',
    [
        upload_product_image.single('product_image'),
        validateRest(addProductSchema, REQUEST_BODY)
    ],
    Admin.addProduct
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