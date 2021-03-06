'use strict';

module.exports = {
    SUCCESS_MESSAGES: {
        SIGN_UP_SUCCESS: "Signed Up Successfully!",
        SIGN_IN_SUCCESS: "Signed In Successfully!",
        ADD_TO_CART_SUCCESS: "Added to Cart Successfully!",
        UPDATE_CART_SUCCESS: "Cart Updated Successfully!",
        ADD_AMOUNT_SUCCESS: "Amount Added Successfully!",
        PASSWORD_CHANGE_SUCCESS: "Password Changed Successfully!",
        UPDATE_PROFILE_SUCCESS: "Profile Updated Successfully!",
        ADD_SUB_ADMIN_SUCCESS: "Sub Admin Added Successfully!",
        EDIT_SUB_ADMIN_PROFILE_SUCCESS: "Sub Admin Profile Edited Successfully!",
        DELETE_SUB_ADMIN_SUCCESS: "Sub Admin Deleted Succefully!",
        RESTORE_SUB_ADMIN_SUCCESS: "Sub Admin Restored Successfully!",
        DELETE_BRAND_SUCCESS: "Brand Deleted Successfully!",
        RESTORE_BRAND_SUCCESS: "Brand Restored Successfully!",
        ADD_BRAND_SUCCESS: "Brand Added Successfully!",
        ADD_BULK_BRAND_SUCCESS: "Bulk Brands Added Successfully!",
        EDIT_BRAND_SUCCESS: "Brand Edited Successfully!",
        DELETE_PRODUCT_SUCCESS: "Product Deleted Successfully!",
        RESTORE_PRODUCT_SUCCESS: "Product Restored Successfully!",
        ADD_PRODUCT_SUCCESS: "Product Added Successfully!",
        ADD_BULK_PRODUCT_SUCCESS: "Bulk Products Added Successfully!",
        EDIT_PRODUCT_SUCCESS: "Product Edited Successfully!",
        DELETE_CATEGORY_SUCCESS: "Category Deleted Successfully!",
        DELETE_SUB_CATEGORY_SUCCESS: "Sub Category Deleted Successfully!",
        RESTORE_CATEGORY_SUCCESS: "Category Restored Successfully!",
        RESTORE_SUB_CATEGORY_SUCCESS: "Sub Category Restored Successfully!",
        ADD_CATEGORY_SUCCESS: "Category Added Successfully!",
        ADD_SUB_CATEGORY_SUCCESS: "Sub Category Added Successfully!",
        ADD_BULK_CATEGORY_SUCCESS: "Bulk Categories Added Successfully!",
        EDIT_CATEGORY_SUCCESS: "Category Edited Successfully!",
        EDIT_SUB_CATEGORY_SUCCESS: "Sub Category Edited Successfully!",
        MARK_DELIVERY_SUCCESS: "Order marked as Deliverd Successfully!",
        EDIT_PROFILE_SUCCESS: "Profile Edited Successfully!",
        DATA_FETCH_SUCCESS: "Data Fetched Successfully!",
        PRODUCTS_FETCH_SUCCESS: "Products Fetched Successfully!",
        CART_FETCH_SUCCESS: "Cart Items Fetched Successfully!",
        WALLET_AMOUNT_FETCH_SUCCESSFULL: "Wallet Amount Fetched Successfully!",
        ORDER_HISTORY_FETCH_SUCCESS: "Order History Fetched Successfully",
        ORDERS_FETCH_SUCCESS: "Orders Fetched Successfully",
    },
    ERROR_MESSAGES: {
        AMOUNT_ISDECIMAL_ERROR: "Amount should be a Valid decimal number!",
        AMOUNT_NOTNULL_ERROR: "Amount should not be Empty or Null!",
        USER_NAME_IS_ALPHANUMERIC_ERROR: "User Name should be a valid alpha-numeric!",
        USER_NAME_LENGTH_ERROR: "User Name length should between 2 and 64",
        EMAIL_UNIQUE_ERROR: "Email already exists!",
        EMAIL_IS_EMAIL_ERROR: "Email should be a valid Email Id!",
        EMAIL_LENGTH_ERROR: "Invalid Email length!",
        PASSWORD_NOTNULL_ERROR: "Password should not be Null or Empty!",
        PRODUCT_NAME_NOTNULL_ERROR: "Product Name should not be null or empty!",
        PRODUCT_NAME_LENGTH_ERROR: "Product Name length should between 2 to 50 characters!",
        QUANTITY_NOTNULL_ERROR: "Quantity should not be null or empty!",
        QUANTITY_IS_INT_ERROR: "Quantity should be a valid number!",
        PRICE_NOTNULL_ERROR: "Price should not be Empty or Null!",
        PRICE_ISDECIMAL_ERROR: "Price should be a Valid decimal number!",
        BRAND_NOTNULL_EMPTY_ERROR: "Brand should not be Null or Empty!",
        BRAND_LENGTH_ERROR: "Brand length should between 2 to 40 characters!",
        BRAND_UNIQUE_ERROR: "Brand already exists!",
        CATEGORY_UNIQUE_ERROR: "Category already Exists!",
        CATEGORY_NOTNULL_EMPTY_ERROR: "Category should not be Null or Empty!",
        CATEGORY_IS_ALPHA_ERROR: "Category Should be a Valid Alpha!",
        CATEGORY_LENGTH_ERROR: "Category length should be less or equal to 25 chharacters",
        SUB_CATEGORY_NOTNULL_EMPTY_ERROR: "Sub Category should not be Null or Empty!",
        SUB_CATEGORY_IS_ALPHA_ERROR: "Sub Category Should be a Valid Alpha!",
        SUB_CATEGORY_LENGTH_ERROR: "Sub Category length should be less or equal to 25 chharacters",
        EDIT_BRAND_CANNOT_BE_SAME_ERROR: "New Brand Name can not be same as Old!",
        EDIT_CATEGORY_CANNOT_BE_SAME_ERROR: "New Category can not be same as Old!",
        EDIT_SUB_CATEGORY_CANNOT_BE_SAME_ERROR: "New Sub Category can not be same as Old!",
        EDIT_PRODUCT_CANNOT_BE_SAME_ERROR: "New Product Details can not be same as Old!",
        EDIT_PROFILE_FAILED_ERROR: "Profile can not be Edited!",
        EDIT_SUB_ADMIN_PROFILE_FAILED_ERROR: "Sub Admin Profile can not be Edited!",
        FILE_IS_CSV_ERROR: "File must be a valid CSV",
        CSV_FILE_REQUIRED_ERROR: "Please Upload a CSV File!",
        WRONG_OTP: "Incorrect OTP!",
        WRONG_PASSWORD: "Incorrect Password!",
        VALIDATION_ERROR: "Validation Errors!",
        EMAIL_ALREADY_EXISTS: "Email Id Already Exists!",
        USER_NOT_FOUND: "User Not Found!",
        INVALID_USER: "Invalid User!",
        USER_NOT_EXISTS: "User does not Exists!",
        WRONG_CREDENTIALS: "Invalid Email ID or Password!",
        UNAUTHORIZED_REQUEST: "Unauthorized Request!",
        ADD_TO_CART_OUT_OF_STOCK_ERROR: "Insufficient Stock to Add!",
        DEFAULT_ERROR: "Something went Wrong!"
    },
    PUBLIC_FORDER_NAME: "public",
    PRODUCTS_IMAGE_PATH: "/images/products/",
    BULK_ADD_FILES_PATH: "/bulk_add_files/",
    VIEW_PATH: {
        ADMIN_VIEWS_PATH: "admin/",
        USER_VIEWS_PATH: "user/",
        SHARED_VIEWS_PATH: "shared/"
    },
    ADMIN_VIEWS: {
        DASHBOARD_VIEW: "dashboard",
        ADD_SUB_ADMIN_VIEW: "add-sub-admin",
        EDIT_SUB_ADMIN_VIEW: "edit-subadmin",
        SUB_ADMINS_VIEW: "sub-admins",
        SUB_ADMINS_TRASH_VIEW: "sub-admins-trash",
        BRANDS_VIEW: "brands",
        BRANDS_TRASH_VIEW: "brands-trash",
        ADD_BRAND_VIEW: "add-brand",
        EDIT_BRAND_VIEW: "edit-brand",
        PRODUCTS_VIEW: "products",
        PRODUCTS_TRASH_VIEW: "products-trash",
        ADD_PRODUCT_VIEW: "add-product",
        ADD_BULK_PRODUCT_VIEW: "add-bulk-product",
        EDIT_PRODUCT_VIEW: "edit-product",
        CATEGORIES_VIEW: "categories",
        CATEGORIES_TRASH_VIEW: "categories-trash",
        ADD_CATEGORY_VIEW: "add-category",
        EDIT_CATEGORY_VIEW: "edit-category",
        EDIT_SUB_CATEGORY_VIEW: "edit-subcategory",
        IN_DELIVERY_ORDERS_VIEW: "in-delivery-orders",
        VERIFY_MARK_DELIVERY_VIEW: "verify-mark-delivery",
        EDIT_PROFILE_VIEW: "edit-profile",
        CHANGE_PASSWORD_VIEW: "change-password"
    },
    USER_VIEWS: {
        HOME_VIEW: "home",
        CART_VIEW: "cart",
        ORDER_STATUS_VIEW: "orderstatus",
        WALLET_VIEW: "wallet",
        COUPON_VIEW: "coupon",
        ORDER_HISTORY_VIEW: "orderhistory",
        UPDATE_PROFILE_VIEW: "updateuser",
    },
    SHARED_VIEWS: {
        SIGN_UP_VIEW: "signup",
        SIGN_IN_VIEW: "signin",
        VERIFY_ACCOUNT_VIEW: "verify"
    },
    VIEW_TITLES: {
        DEFAULT_TITLE: "E-Trading",
        ADMIN_VIEW_TITLES: {
            DASHBOARD_TITLE: "E-Trading - Admin Dashboard",
            ADD_SUB_ADMIN_TITLE: "E-Trading - Add Sub Admin",
            EDIT_SUB_ADMIN_TITLE: "E-Trading - Edit Sub Admin",
            SUB_ADMINS_TITLE: "E-Trading - Sub Admins",
            SUB_ADMINS_TRASH_TITLE: "E-Trading - Sub Admins Trash",
            BRANDS_TITLE: "E-Trading - Brands",
            BRANDS_TRASH_TITLE: "E-Trading - Brands Trash",
            ADD_BRAND_TITLE: "E-trading - Add Brand",
            EDIT_BRAND_TITLE: "E-Trading - Edit Brand",
            PRODUCTS_TITLE: "E-Trading - Products",
            PRODUCTS_TRASH_TITLE: "E-Trading - Products Trash",
            ADD_PRODUCT_TITLE: "E-Trading - Add Product",
            ADD_BULK_PRODUCT_TITLE: "E-Trading - Add Bulk Product",
            EDIT_PRODUCT_TITLE: "E-Trading - Edit Product",
            CATEGORIES_TITLE: "E-Trading - Categories",
            CATEGORIES_TRASH_TITLE: "E-Trading - Categories Trash",
            ADD_CATEGORY_TITLE: "E-Trading - Add Category",
            EDIT_CATEGORY_TITLE: "E-Trading - Edit Category",
            EDIT_SUB_CATEGORY_TITLE: "E-Trading - Edit Sub Category",
            IN_DELIVERY_ORDERS_TITLE: "E-Trading - In Delivery Orders",
            VERIFY_MARK_DELIVERY_TITLE: "E-Trading - Verify Mark Delivery",
            EDIT_PROFILE_TITLE: "E-Trading - Edit Profile Category",
            CHANGE_PASSWORD_TITLE: "E-Trading - Change Password"
        },
        USER_VIEW_TITLES: {
            HOME_TITLE: "E-Trading - Home",
            CART_TITLE: "E-Trading - Cart",
            ORDER_STATUS_TITLE: "E-Trading - Order Status",
            WALLET_TITLE: "E-Trading - Wallet",
            COUPON_TITLE: "E-Trading - Discount Coupons",
            ORDER_HISTORY_TITLE: "E-Trading - Order History",
            UPDATE_PROFILE_TITLE: "E-Trading - Update Profile"
        },
        SHARED_VIEW_TITLES: {
            SIGN_UP_TITLE: "E-Trading - Sign Up",
            SIGN_IN_TITLE: "E-Trading - Sign In",
            VERIFY_ACCOUNT_TITLE: "E-Trading - Verify Account"
        }
    },
    REQUEST_PROPERTIES: {
        REQUEST_BODY: "body",
        REQUEST_PARAMS: "params",
        REQUEST_QUERY: "query",
        REQUEST_COOKIES: "cookies",
        REQUEST_USERDATA: "userData",
        REQUEST_FILENAME: "fileName",
        REQUEST_CUSTOM: "customData"
    },
    COOKIE_NAMES: {
        AUTH_TOKEN: "auth_token",
        EDIT_SUB_ADMIN_TOKEN: "subadmin_token",
        EDIT_BRAND_TOKEN: "brand_token",
        EDIT_CATEGORY_TOKEN: "category_token",
        EDIT_SUB_CATEGORY_TOKEN: "subcategory_token",
        EDIT_PRODUCT_TOKEN: "product_token",
        ORDER_TOKEN: "order_token",
    },
    TOKEN_MAX_AGE: {
        AUTH_TOKEN_MAX_AGE: 60 * 60,    // 1 hour (IN SECONDS),
        EDIT_SUB_ADMIN_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
        EDIT_BRAND_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
        EDIT_CATEGORY_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
        EDIT_SUB_CATEGORY_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
        EDIT_PRODUCT_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
        ORDER_TOKEN_MAX_AGE: 10 * 60,      // 10 minute (IN SECONDS),
    },
    COOKIE_MAX_AGE: {
        AUTH_TOKEN_COOKIE_MAX: 60 * 60 * 1000,      // 1 hour  (IN MICRO SECONDS),
        EDIT_SUB_ADMIN_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
        EDIT_BRAND_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
        EDIT_CATEGORY_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
        EDIT_SUB_CATEGORY_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
        EDIT_PRODUCT_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
        ORDER_COOKIE_MAX_AGE: 10 * 60 * 1000,      // 10 minute (IN MICRO SECONDS),
    },
    MAIL_SUBJECTS: {
        VERIFY_ACCOUNT_MAIL_SUBJECT: "Please verify email to Activate your account!",
        UPDATE_USER_PROFILE_MAIL_SUBJECT: "Please verify email to Update your Profile details!",
        GET_BONUS_AMOUNT_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        GET_DISCOUNT_COUPON_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        GET_PRODUCT_PURCHASE_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        PURCHASE_INVOICE_MAIL_SUBJECT: "Purchase Invoice!",
        MARK_DELIVERY_MAIL_SUBJECT: "Confirm Your Order Delivery!"
    },
    ORDER_STATUS: {
        ORDER_STATUS_PENDING: "pending",
        ORDER_STATUS_FAILED: "failed",
        ORDER_STATUS_SUCCESS: "success",
        ORDER_STATUS_IN_DELIVERY: "success",
        ORDER_STATUS_DELIVERED: "delivered"
    },
    ORDER_REMARKS: {
        PRODUCT_OUT_OF_STOCK: "Insufficient Product Quantity!",
        PAYMENT_PENDING: "Payment Pending!",
        INVALID_COUPON: "Invalid Coupon Code!",
        INSUFFICIENT_WALLET_AMOUNT: "Insufficient Wallet Amount!",
        ORDER_CANCELED: "Order Canceled!",
        ORDER_PLACED_SUCCESS: "Order Placed!",
        ORDER_IN_DELIVERY: "Order in Delivery!",
        ORDER_DELIVERED: "Order Delivered!"
    },
    COUPON_TYPES: {
        COUPON_DYNAMIC: "dynamic",
        COUPON_STATIC: "static",
        DEFAULT_COUPON_TYPE: "static"
    },
    OTP_FOR: {
        OTP_FOR_MARK_DELIVERY: "mark_delivery",
    },
    DEFAULTS: {
        DEFAULT_SUBCATEGORY: "General",
        DEFAULT_PRODUCT_IMAGE_NAME: "default.jpg"
    }
};