'use strict';


exports.getProductPagination = ({ page, size }) => {
    const limit = size ? +size : 6;
    const offset = page ? (+page-1) * limit : 0;

    return { limit, offset };
};

exports.getProductPaginationData = ({ data, page, limit }) => {
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil( totalItems / limit );
    const size = limit;

    return { totalItems, products, totalPages, currentPage, size };
};

exports.getCartPagination = ({ page, size }) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

exports.getCartPaginationData = ({ data, page, limit }) => {
    const { count: totalItems, rows: cartItems } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil( totalItems / limit );
    const size = limit;

    return { totalItems, cartItems, totalPages, currentPage, size };
};

exports.getCouponPagination = ({ page, size }) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

exports.getCouponPaginationData = ({ data, page, limit }) => {
    const { count: totalItems, rows: coupons } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil( totalItems / limit );
    const size = limit;

    return { totalItems, coupons, totalPages, currentPage, size };
};

exports.getOrderHistoryPagination = ({ page, size }) => {
    const limit = size ? +size : 5;
    const offset = page ? (+page-1) * limit : 0;

    return { limit, offset };
};

exports.getOrderHistoryPaginationData = ({ data, page, limit }) => {
    const { count: totalItems, rows: orders } = data;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil( totalItems / limit );
    const size = limit;

    return { totalItems, orders, totalPages, currentPage, size };
};

/**
 * @description Helper function to get Pagination limit and offset
 */
exports.pagination = ({page=1, size=3}) => {
    const limit = parseInt(size ? size: 3);
    const offset = parseInt(page ? (page - 1) * limit : 0);
    
    return { limit, offset };
};

/**
 * @description Helper function to get Pagination Meta Data
 */
exports.paginationMetaData = (items, page, limit) => {
    const { count: totalItems, rows } = items;
    const currentPage = parseInt(page ? page : 1);
    const totalPages = Math.ceil(totalItems / limit);
    const size = limit;

    return { rows, totalItems, totalPages, currentPage, size };
};