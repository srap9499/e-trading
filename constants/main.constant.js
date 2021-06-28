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
        DELETE_SUB_ADMIN_SUCCESS: "Sub Admin Deleted Succefully!",
        RESTORE_SUB_ADMIN_SUCCESS: "Sub Admin Restored Successfully!",
        DELETE_BRAND_SUCCESS: "Brand Deleted Successfully!",
        RESTORE_BRAND_SUCCESS: "Brand Restored Successfully!",
        DATA_FETCH_SUCCESS: "Data Fetched Successfully!",
        PRODUCTS_FETCH_SUCCESS: "Products Fetched Successfully!",
        CART_FETCH_SUCCESS: "Cart Items Fetched Successfully!",
        WALLET_AMOUNT_FETCH_SUCCESSFULL: "Wallet Amount Fetched Successfully!",
        ORDER_HISTORY_FETCH_SUCCESS: "Order History Fetched Successfully",
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
    VIEW_PATH: {
        ADMIN_VIEWS_PATH: "admin/",
        USER_VIEWS_PATH: "user/",
        SHARED_VIEWS_PATH: "shared/"
    },
    ADMIN_VIEWS: {
        DASHBOARD_VIEW: "dashboard",
        ADD_SUB_ADMIN_VIEW: "add-sub-admin",
        SUB_ADMINS_VIEW: "sub-admins",
        SUB_ADMINS_TRASH_VIEW: "sub-admins-trash",
        BRANDS_VIEW: "brands",
        BRANDS_TRASH_VIEW: "brands-trash"
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
            SUB_ADMINS_TITLE: "E-Trading - Sub Admins",
            SUB_ADMINS_TRASH_TITLE: "E-Trading - Sub Admins Trash",
            BRANDS_TITLE: "E-Trading - Brands",
            BRANDS_TRASH_TITLE: "E-Trading - Brands Trash"
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
        REQUEST_USERDATA: "userData"
    },
    COOKIE_NAMES: {
        AUTH_TOKEN: "auth_token"
    },
    TOKEN_MAX_AGE: {
        AUTH_TOKEN_MAX_AGE: 60 * 60,    // 1 hour (IN SECONDS)
    },
    COOKIE_MAX_AGE: {
        AUTH_TOKEN_COOKIE_MAX: 60 * 60 * 1000,      // 1 hour  (IN MICRO SECONDS)
    },
    MAIL_SUBJECTS: {
        VERIFY_ACCOUNT_MAIL_SUBJECT: "Please verify email to Activate your account!",
        UPDATE_USER_PROFILE_MAIL_SUBJECT: "Please verify email to Update your Profile details!",
        GET_BONUS_AMOUNT_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        GET_DISCOUNT_COUPON_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        GET_PRODUCT_PURCHASE_NOTIFICATION_MAIL_SUBJECT: "E-Trading: Notification!",
        PURCHASE_INVOICE_MAIL_SUBJECT: "Purchase Invoice!"
    },
    ORDER_REMARKS: {
        PRODUCT_OUT_OF_STOCK: "Insufficient Product Quantity!",
        PAYMENT_PENDING: "Payment Pending!",
        INVALID_COUPON: "Invalid Coupon Code!",
        INSUFFICIENT_WALLET_AMOUNT: "Insufficient Wallet Amount!",
        ORDER_CANCELED: "Order Canceled!",
        ORDER_PLACED_SUCCESS: "Order Placed!"
    }
};