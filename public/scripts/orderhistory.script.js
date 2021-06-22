let queryData = {
    status: $('#status').val() ? $('#status').val() : '',
    sortBy: $('#sort-by').val() ? $('#sort-by').val() : 'date',
    orderBy: $('#order-by').val() ? $('#order-by').val() : 'DESC',
    page: 1,
    size: $('#page-size').val() ? $('#page-size').val() : 5,
};

const createPagination = (totalPages) => {
    let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
    $('ul.pagination').append(pageIndex);

    for (let i = 1; i <= totalPages; i++) {
        if (i == queryData.page) {
            pageIndex = `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            pageIndex = `<li class="page-item"><a class="page-link">${i}</a></li>`;
        }
        $('ul.pagination').append(pageIndex);
    }

    pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
    $('ul.pagination').append(pageIndex);
};

// Format to Date-time string
const formatDateTime = (date) => {
    const dateObj = new Date(date);
    const options = { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return dateObj.toLocaleString('en', options);
};

// Format to Date string
const formatDate = (date) => {
    const dateObj = new Date(date);
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return dateObj.toLocaleDateString('en', options);
};

// Format to Time string
const formatTime = (date) => {
    const dateObj = new Date(date);
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return dateObj.toLocaleTimeString('en', options);
}

const setOrderDetails = (orderdetails) => {
    let details = '', price = '', quantity = '', subTotal = '';
    for (const detail of orderdetails) {
        details += `<p style="display: table-row-group;">- ${detail.product.name}</p>`;
        price += `<p style="display: table-row-group;">&#8377; ${detail.product.price}</p>`;
        quantity += `<p style="display: table-row-group;">${detail.quantity}</p>`;
        subTotal += `<p style="display: table-row-group;">&#8377; ${detail.total}</p>`;
    }
    return { details, price, quantity, subTotal };
};

const getData = () => {
    $.ajax({
        type: "GET",
        url: '/user/orders/history',
        data: queryData,
        success: (response) => {
            $('#alert').empty().attr('hidden', 'true').removeClass('alert-danger').addClass('alert-success');
            const { orders, totalPages } = response;
            if (!orders || !orders.length) {
                if ($('ul.pagination li').length -2 != totalPages) {
                    $('ul.pagination').empty();
                }
                if (totalPages < 1 && queryData.status==='') {
                    $('select#status').attr('hidden', 'true');
                } else {
                    $('select#status').removeAttr('hidden');
                }
                if (totalPages < 1) {
                    $('select#page-size').parent().attr('hidden', 'true');
                } else {
                    $('select#page-size').parent().removeAttr('hidden');
                }
                $('#nothing-to-display').removeAttr('hidden');
                $('#order-history, select#sort-by, select#order-by').attr('hidden', 'true');
                return $('#order-history tbody').empty();
            }
            $('#nothing-to-display').attr('hidden', 'true');
            $('#order-history , select#status, select#sort-by, select#order-by').removeAttr('hidden');
            $('select#page-size').parent().removeAttr('hidden');
            $('#order-history tbody').empty();

            $.each(orders, (i, order) => {
                order.date = formatDateTime(order.date);
                const detailRow = setOrderDetails(order.orderdetails);
                let tr_id = 'tr_' + order.id;
                let orderRow = `<tr id="${tr_id}">
                <td style="width: max-content;">${order.id}</td>
                <td style="max-width: 135px;">${order.date}</td>
                <td style="width: max-content;">${detailRow.details}</td>
                <td style="width: max-content;">${detailRow.price}</td>
                <td style="width: max-content;">${detailRow.quantity}</td>
                <td style="width: max-content;">${detailRow.subTotal}</td>
                <td style="width: max-content;">&#8377; ${order.discountedAmount}</td>
                <td style="width: max-content;"><a class="${order.status}" href="/cart/checkout/${order.id}/status">${order.status}</a></td>
                <td style="max-width: 130px;">${order.remark}</td>
                </tr>`;
                $('#order-history tbody').append(orderRow);
            });

            if ($('ul.pagination li').length - 2 != response.totalPages) {
                $('ul.pagination').empty();
                createPagination(response.totalPages);
            }
        },
        error: (error) => {
            $('#alert').empty().removeAttr('hidden').removeClass('alert-success').addClass('alert-danger').append(error.responseJSON.message.body);
        }
    });
};

const paginate = function () {
    let val = $(this).text();
    console.log("hello",$(this).text());

    if (val.toUpperCase()==="NEXT") {
        console.log("next");
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getData();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getData();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = +val;
    getData();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).ready(getData);

$('ul.pagination li a').on('click', paginate);

const filterByStatus = function () {
    queryData.page = 1;
    queryData.status = $(this).val() ? $(this).val() : '';
    getData();
};

const sortBy = function() {
    queryData.sortBy = $(this).val() ? $(this).val() : 'date';
    getData();
}

const orderBy = function() {
    queryData.orderBy = $(this).val() ? $(this).val() : 'DESC';
    getData();
}

const changePageSize = function() {
    queryData.page = 1;
    queryData.size = $(this).val() ? $(this).val() : 5;
    getData();
};

$('select#status').on('change', filterByStatus);

$('select#sort-by').on('change', sortBy);

$('select#order-by').on('change', orderBy);

$('select#page-size').on('change', changePageSize);