'use strict';


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