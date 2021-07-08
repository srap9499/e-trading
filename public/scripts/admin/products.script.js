'use strict';

let currentEntries = 0;

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successAlert = (message={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-danger')
        .addClass('alert-success');
};

const errorAlert = (message={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger');
};

const sortByOptions = {
    1: ['id', 'ASC'],
    2: ['id', 'DESC'],
    3: ['name', 'ASC'],
    4: ['name', 'DESC'],
    5: ['price', 'ASC'],
    6: ['price', 'DESC']
};

const queryData = {
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
            <option class="small" value=1 selected>Sort By</option>
            <option class="small" value=1>Product Id Asc</option>
            <option class="small" value=2>Product Id Desc</option>
            <option class="small" value=3>Product Name Asc</option>
            <option class="small" value=4>Product Name Desc</option>
            <option class="small" value=5>Price: Low to High</option>
            <option class="small" value=6>Price: High to Low</option>
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
        <table id="products-table" class="table table-sm table-md table-lg table-light table-striped table-hover lead">
            <thead class="small border-1">
                <tr>
                    <th scope="col" class="align-middle small">P.ID</th>
                    <th scope="col" class="align-middle small">Name</th>
                    <th scope="col" class="align-middle small">Brand</th>
                    <th scope="col" class="align-middle small">Category</th>
                    <th scope="col" class="align-middle small">Subcategory</th>
                    <th scope="col" class="align-middle small">Qty</th>
                    <th scope="col" class="align-middle small">Price</th>
                    <th scope="col" class="align-middle small">Action</th>
                </tr>
            </thead>
            <tbody class="small border-1">
            </tbody>
        </table>
    </div>
</div>`;

const editProduct = id => {
    return () => {
        window.location.href = `/admin/product/${id}/edit`;
    };
};

const deleteProduct = id => {
    return () => {
        $.ajax({
            type: 'DELETE',
            url: `/admin/product/${id}/delete`,
            success: response => {
                const { message } = response;
                successAlert(message);
                if (currentEntries <=1 && queryData.page > 1) {
                    queryData.page -= 1;
                }
                getProducts();
            },
            error: response => {
                const { responseJSON: { message } } = response;
                errorAlert(message);
            }
        });
    };
};

const createRow = (rowData) => {
    const { id, name, brand, category, subcategory, quantity, price } = rowData;
    let brandValue = '--',
        categoryValue = '--',
        subcategoryValue = '--';
    if (brand && brand.name) {
        brandValue = `${brand.name}`;
    }
    if (category && category.category) {
        categoryValue = `${category.category}`;
    }
    if (subcategory && subcategory.subcategory) {
        subcategoryValue = `${subcategory.subcategory}`;
    }
    const productRow = `
    <tr>
        <td class="small">
            ${id}
        </td>
        <td class="small">
            ${name}
        </td>
        <td class="small">
            ${brandValue}
        </td>
        <td class="small">
            ${categoryValue}
        </td>
        <td class="small">
            ${subcategoryValue}
        </td>
        <td class="small">
            ${quantity}
        </td>
        <td class="small">
            &#8377;&nbsp;${price}
        </td>
        <td class="small">
            <div class="row gx-4 gy-0 text-center">
                <div class="col-3">
                    <i id="edit${id}" class="fas fa-pencil-alt" title="Edit Product"></i>
                </div>
                <div class="col-3">
                    <i id="delete${id}" class="fas fa-trash" title="Delete Product"></i>
                </div>
            </div>
        </td>
    </tr>`;

    $('#products-table tbody').append(productRow);

    $(`#edit${id}`).on('click', editProduct(id));
    $(`#delete${id}`).on('click', deleteProduct(id));
}

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


const getProducts = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/products/get',
        data: queryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            $('#products-area').empty();
            if (!rows || !rows.length) {
                currentEntries = rows.length??0;
                if ($('ul.pagination li').length - 2 != totalPages) {
                    $('ul.pagination').empty();
                    $('#options-area').empty();
                }
                $('#products-area').append(nothingArea);
                return;
            }
            currentEntries = rows.length;

            $('#products-area').append(tableArea);

            $.each(rows, (i, product) => {
                createRow(product);
            });


            if ($('ul.pagination li').length - 2 != totalPages) {
                $('ul.pagination').empty();
                $('#options-area').empty();
                createPagination(totalPages);
                $('#options-area').append(optionsArea);
            }
        },
        error: response => {
            const { responseJSON: { message } } = response;
            errorAlert(message);
        }
    });
};

$(document).ready(getProducts);


const paginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getProducts();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getProducts();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = parseInt(val);
    getProducts();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).on('click', 'ul.pagination li a', paginate);

const sortBy = function() {
    queryData.order = sortByOptions[$(this).val()]??sortByOptions[1];
    getProducts();
}

const changePageSize = function() {
    queryData.page = 1;
    queryData.size = $(this).val() ? $(this).val() : 5;
    getProducts();
};

$(document).on('change', 'select#sort-by', sortBy);

$(document).on('change', 'select#page-size', changePageSize);

$('#close-alert').on('click', clearAlert);