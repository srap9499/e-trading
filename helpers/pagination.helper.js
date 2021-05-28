'use strict';


exports.getProductPagination = ({ page, size }) => {
    const limit = size ? +size : 6;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

exports.getProductPaginationData = ({ data, page, limit }) => {
    const { count: totalItems, rows: products } = data;
    const currentPage = page ? +page : 0;
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