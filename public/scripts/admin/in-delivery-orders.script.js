'use strict';

let currentEntries = 0;

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
    .attr('hidden', 'true')
    .removeClass('alert-success alert-danger');
};

const successAlert = (message={}) => {
    clearAlert();
    if (message.body) {
        $('#alert div')
        .append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    }
};

const errorAlert = (message={}) => {
    clearAlert();
    if (message.body) {
        $('#alert div')
        .append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    }
};

const sortByOptions = {
    1: ['id', 'ASC'],
    2: ['id', 'DESC'],
    3: ['date', 'ASC'],
    4: ['date', 'DESC'],
    5: ['totalAmount', 'ASC'],
    6: ['totalAmount', 'DESC'],
    7: ['discountedAmount', 'ASC'],
    8: ['discountedAmount', 'DESC']
};

const queryData = {
    status: 'success',
    order: sortByOptions[$('#sort-by').val()],
    page: 1,
    size: $('#page-size').val()??5
};

const optionsArea = `
<div class="row gy-3 gx-2">
    <div class="col-5 col-md-2">
        <select name="page-size" id="page-size" class="form-select small py-0 py-sm-1">
            <option value=5 selected>Page Size</option>
            <option value=5>5</option>
            <option value=10>10</option>
            <option value=15>15</option>
        </select>
    </div>
    <div class="col-7 col-md-3">
        <select name="sort-by" id="sort-by" class="form-select small py-0 py-sm-1">
            <option class="small" value=3 selected>Sort By</option>
            <option class="small" value=1>Order Id Asc</option>
            <option class="small" value=2>Order Id Desc</option>
            <option class="small" value=3>Date: Oldest</option>
            <option class="small" value=4>Date: Latest</option>
            <option class="small" value=5>Total Amount: low-to-high</option>
            <option class="small" value=6>Total Amount: high-to-low</option>
            <option class="small" value=7>Payable Amount: low-to-high</option>
            <option class="small" value=8>Payable Amount: high-to-low</option>
        </select>
    </div>
</div>
<hr class="my-sm-2 my-md-3 my-lg-4">`;

const nothingArea = `
<div class="row gy-3">
    <div class="col-xs-12 col-12">
        <small class="lead">Nothing to display here&mldr;</small>
    </div>
</div>`;

const tableArea = `
<div class="row gy-3 table-responsive-parent">
    <div class="col-xs-12 col-12">
        <table id="orders-table" class="table table-light table-striped table-hover lead">
            <thead class="small border-1">
                <tr>
                    <th scope="col" class="align-middle small">O.ID</th>
                    <th scope="col" class="align-middle small">Date</th>
                    <th scope="col" class="align-middle small">Buyer's Email</th>
                    <th scope="col" class="align-middle small">Product Details</th>
                    <th scope="col" class="align-middle small">Total</th>
                    <th scope="col" class="align-middle small">Payable Amount</th>
                    <th scope="col" class="align-middle small"></th>
                </tr>
            </thead>
            <tbody id="orders-tbody" class="small border-1">
            </tbody>
        </table>
    </div>
</div>`;

const generateProductDetails = (details) => {
    let productTableArea = '';
    let productRows = '';
    $.each(details, (i, item) => {
        const { product, quantity, total } = item;
        const { id, name, brand, price } = product;
        const itemRow = `
            <tr>
                <td class="small text-muted">${id}</td>
                <td class="small text-muted">${name}</td>
                <td class="small text-muted">${brand}</td>
                <td class="small text-muted">${quantity}</td>
                <td class="small text-muted">&#8377;&nbsp;${price}</td>
                <td class="small text-muted">&#8377;&nbsp;${total}</td>
            </tr>`;
        productRows += itemRow;
    });
    if (productRows) {
        productTableArea = `
            <table class="table table-light table-striped table-hover table-sm my-0">
                <thead class="small border-1">
                    <tr>
                        <th scope="col" class="align-middle small text-muted">P.ID</th>
                        <th scope="col" class="align-middle small text-muted">Name</th>
                        <th scope="col" class="align-middle small text-muted">Brand</th>
                        <th scope="col" class="align-middle small text-muted">Qty</th>
                        <th scope="col" class="align-middle small text-muted">Price</th>
                        <th scope="col" class="align-middle small text-muted">Sub Total</th>
                    </tr>
                </thead>
                <tbody class="small border-1">
                    ${productRows}
                </tbody>
            </table>`;
    }
    return productTableArea;
};

const markDelivery = (id) => {
    return () => {
        window.location.href = `/admin/order/${id}/markdelivery`;
    };
};

const createRow = (rowData) => {
    const { id, date, email, orderdetails, totalAmount, discountedAmount } = rowData;
    const detailsTable = generateProductDetails(orderdetails);
    const orderRow = `
        <tr>
            <td class="small">${id}</td>
            <td class="small">${date}</td>
            <td class="small">${email}</td>
            <td class="small table-responsive-parent">
                ${detailsTable}  
            </td>
            <td class="small">&#8377;&nbsp;${totalAmount}</td>
            <td class="small">&#8377;&nbsp;${discountedAmount}</td>
            <td class="small">
                <div class="row gx-2 gy-0 text-center">
                    <div class="col-12">
                        <i id="markdelivery${id}" class="far fa-check-square" title="Mark Delivered!"></i>
                    </div>
                </div>
            </td>
        </tr>`;
    
    $('#orders-table tbody#orders-tbody').append(orderRow);

    $(`#markdelivery${id}`).on('click', markDelivery(id));
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

const getOrders = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/orders/get',
        data: queryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            $('#orders-area').empty();
            if (!rows || !rows.length) {
                currentEntries = rows.length??0;
                if ($('ul.pagination li').length - 2 != totalPages) {
                    $('ul.pagination').empty();
                    $('#options-area').addClass('d-none');
                }
                $('#orders-area').append(nothingArea);
                return;
            }
            currentEntries = rows.length;

            $('#orders-area').append(tableArea);

            $.each(rows, (i, order) => {
                createRow(order);
            });

            if ($('ul.pagination li').length - 2 != totalPages) {
                $('#options-area').removeClass('d-none');
                $('ul.pagination').empty();
                createPagination(totalPages);
            }
        },
        error: response => {
            console.log("error");
            console.log(response.responseJSON);
        }
    });
};

const paginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getOrders();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getOrders();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = parseInt(val);
    getOrders();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

const sortBy = function() {
    queryData.order = sortByOptions[$(this).val()]??sortByOptions[3];
    getOrders();
}

const changePageSize = function() {
    queryData.page = 1;
    queryData.size = $(this).val() ? $(this).val() : 5;
    getOrders();
};

const onReady = () => {
    $('#options-area').addClass('d-none').empty().append(optionsArea);
    getOrders();
    
    $(document).on('change', '#sort-by', sortBy);
    $(document).on('change', '#page-size', changePageSize);
    $(document).on('click', 'ul.pagination li a', paginate);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);