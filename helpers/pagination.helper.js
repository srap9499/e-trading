'use strict';


exports.getProductPagination = ({ page, size }) => {
    const limit = size ? +size : 5;
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