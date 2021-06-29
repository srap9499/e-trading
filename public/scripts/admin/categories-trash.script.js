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
    3: ['category', 'ASC'],
    4: ['category', 'DESC']
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
            <option class="small" value=1>Category Id Asc</option>
            <option class="small" value=2>Category Id Desc</option>
            <option class="small" value=3>Category Asc</option>
            <option class="small" value=4>Category Desc</option>
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

const categoriesTableArea = `
<div class="row gy-3 table-responsive-parent">
    <div class="col-xs-12 col-12">
        <table id="categories-table" class="table table-sm table-md table-lg table-light table-striped table-hover lead">
            <thead class="small border-1">
                <tr>
                    <th scope="col" class="align-middle small">C.ID</th>
                    <th scope="col" class="align-middle small">Category</th>
                    <th scope="col" class="align-middle small">Subcategories</th>
                    <th scope="col" class="align-middle small">Action</th>
                </tr>
            </thead>
            <tbody class="small border-1">
            </tbody>
        </table>
    </div>
</div>`;

const createCategoryRow = (rowData) => {
    const { id, category, subcategories } = rowData;
    let subcategory = '';
    $.each(subcategories, (i, item) => {
        const subcategoryRow = `
        <div class="row gx-1 gy-0">
            <div class="col-2 col-md-2">
                <p class="muted-text small py-0 my-0">${item.id}</p>
            </div>
            <div class="col-7 col-md-10">
                <p class="muted-text small py-0 my-0">${item.subcategory}</p>
            </div>
        </div>`;
        subcategory += subcategoryRow;
    });
    const categoryRow = `
    <tr>
        <td class="small">
            ${id}
        </td>
        <td class="small">
            ${category}
        </td>
        <td class="small">
            ${subcategory}
        </td>
        <td class="small">
        </td>
    </tr>`;

    $('#categories-table tbody').append(categoryRow);
};

const createCategoryPagination = (totalPages) => {
    let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
    $('ul#category-page.pagination').append(pageIndex);

    for (let i = 1; i <= totalPages; i++) {
        if (i == queryData.page) {
            pageIndex = `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            pageIndex = `<li class="page-item"><a class="page-link">${i}</a></li>`;
        }
        $('ul#category-page.pagination').append(pageIndex);
    }

    pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
    $('ul#category-page.pagination').append(pageIndex);
};


const getCategories = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/categories/trash/get',
        data: queryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            console.log(rows);
            $('#categories-area').empty();
            if (!rows || !rows.length) {
                currentEntries = rows.length??0;
                if ($('ul#category-page.pagination li').length - 2 != totalPages) {
                    $('ul#category-page.pagination').empty();
                    $('#options-area').empty();
                }
                $('#categories-area').append(nothingArea);
                return;
            }
            currentEntries = rows.length;

            $('#categories-area').append(categoriesTableArea);

            $.each(rows, (i, category) => {
                createCategoryRow(category);
            });


            if ($('ul#category-page.pagination li').length - 2 != totalPages) {
                $('ul#category-page.pagination').empty();
                $('#options-area').empty();
                createCategoryPagination(totalPages);
                $('#options-area').append(optionsArea);
            }
        },
        error: response => {
            const { responseJSON: { message } } = response;
            errorAlert(message);
        }
    });
};

$(document).ready(getCategories);


const categoryPaginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul#category-page.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul#category-page.pagination li.active');
            getCategories();
            $('ul#category-page.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul#category-page.pagination li.active');
            getCategories();
            $('ul#category-page.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = parseInt(val);
    getCategories();
    $('ul#category-page.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).on('click', 'ul#category-page.pagination li a', categoryPaginate);

const sortBy = function() {
    queryData.order = sortByOptions[$(this).val()]??sortByOptions[1];
    getCategories();
}

const changePageSize = function() {
    queryData.page = 1;
    queryData.size = $(this).val() ? $(this).val() : 5;
    getCategories();
};

$(document).on('change', 'select#sort-by', sortBy);

$(document).on('change', 'select#page-size', changePageSize);

$('#close-alert').on('click', clearAlert);