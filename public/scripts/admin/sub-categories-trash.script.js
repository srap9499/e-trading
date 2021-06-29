'use strict';

let currentSubEntries = 0;


const clearSubAlert = () => {
    $('#sub-alert div').empty();
    $('#sub-alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successSubAlert = (message={}) => {
    $('#sub-alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-danger')
        .addClass('alert-success');
};

const errorSubAlert = (message={}) => {
    $('#sub-alert div').empty()
        .append(message.body);
    $('#sub-alert')
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger');
};

const subSortByOptions = {
    1: ['id', 'ASC'],
    2: ['id', 'DESC'],
    3: ['category', 'ASC'],
    4: ['category', 'DESC']
};

const subQueryData = {
    order: subSortByOptions[$('#sub-sort-by').val()],
    page: 1,
    size: $('#sub-page-size').val()??5
};

const subOptionsArea = `
<div class="row gy-3 gx-2">
    <div class="col-5 col-md-2">
        <select name="page-size" id="sub-page-size" class="form-select small py-0 py-sm-1">
            <option value=5 selected>Page Size</option>
            <option value=5>5</option>
            <option value=10>10</option>
            <option value=15>15</option>
        </select>
    </div>
    <div class="col-7 col-md-3">
        <select name="sort-by" id="sub-sort-by" class="form-select small py-0 py-sm-1">
            <option class="small" value=1 selected>Sort By</option>
            <option class="small" value=1>Category Id Asc</option>
            <option class="small" value=2>Category Id Desc</option>
            <option class="small" value=3>Category Asc</option>
            <option class="small" value=4>Category Desc</option>
        </select>
    </div>
</div>
<hr class="my-sm-2 my-md-3 my-lg-4">`;

const subCategoriesTableArea = `
<div class="row gy-3 table-responsive-parent">
    <div class="col-xs-12 col-12">
        <table id="sub-categories-table" class="table table-sm table-md table-lg table-light table-striped table-hover lead">
            <thead class="small border-1">
                <tr>
                    <th scope="col" class="align-middle small">C.ID</th>
                    <th scope="col" class="align-middle small">Category</th>
                    <th scope="col" class="align-middle small">Subcategories</th>
                </tr>
            </thead>
            <tbody class="small border-1">
            </tbody>
        </table>
    </div>
</div>`;

const createSubCategoryRow = (rowData) => {
    const { id, category, subcategories } = rowData;
    let subCategory = '';
    $.each(subcategories, (i, item) => {
        const { id, subcategory } = item;
        const subcategoryRow = `
        <div class="row gx-1 gy-0">
            <div class="col-2 col-md-1">
                <p class="muted-text small py-0 my-0">${id}</p>
            </div>
            <div class="col-7 col-md-8">
                <p class="muted-text small py-0 my-0">${subcategory}</p>
            </div>
        </div>`;
        subCategory += subcategoryRow;
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
            ${subCategory}
        </td>
    </tr>`;

    $('#sub-categories-table tbody').append(categoryRow);
};

const createSubCategoryPagination = (totalPages) => {
    let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
    $('ul#sub-category-page.pagination').append(pageIndex);

    for (let i = 1; i <= totalPages; i++) {
        if (i == subQueryData.page) {
            pageIndex = `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            pageIndex = `<li class="page-item"><a class="page-link">${i}</a></li>`;
        }
        $('ul#sub-category-page.pagination').append(pageIndex);
    }

    pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
    $('ul#sub-category-page.pagination').append(pageIndex);
};


const getSubCategories = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/subcategories/trash/get',
        data: subQueryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            console.log(rows);
            $('#sub-categories-area').empty();
            if (!rows || !rows.length) {
                currentSubEntries = rows.length??0;
                if ($('ul#sub-category-page.pagination li').length - 2 != totalPages) {
                    $('ul#sub-category-page.pagination').empty();
                    $('#options-area').empty();
                }
                $('#sub-categories-area').append(nothingArea);
                return;
            }
            currentSubEntries = rows.length;

            $('#sub-categories-area').append(subCategoriesTableArea);

            $.each(rows, (i, category) => {
                createSubCategoryRow(category);
            });


            if ($('ul#sub-category-page.pagination li').length - 2 != totalPages) {
                $('ul#sub-category-page.pagination').empty();
                $('#sub-options-area').empty();
                createSubCategoryPagination(totalPages);
                $('#sub-options-area').append(subOptionsArea);
            }
        },
        error: response => {
            const { responseJSON: { message } } = response;
            errorSubAlert(message);
        }
    });
};


$(document).ready(getSubCategories);



const subCategoryPaginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul#sub-category-page.pagination li').length - 2;
        if (subQueryData.page < totalPage) {
            subQueryData.page += 1;
            let currentActive = $('ul#sub-category-page.pagination li.active');
            getSubCategories();
            $('ul#sub-category-page.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (subQueryData.page > 1) {
            subQueryData.page -= 1;
            let currentActive = $('ul#sub-category-page.pagination li.active');
            getSubCategories();
            $('ul#sub-category-page.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    subQueryData.page = parseInt(val);
    getSubCategories();
    $('ul#sub-category-page.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).on('click', 'ul#sub-category-page.pagination li a', subCategoryPaginate);

const subSortBy = function() {
    subQueryData.order = subSortByOptions[$(this).val()]??subSortByOptions[1];
    getSubCategories();
}

const subChangePageSize = function() {
    subQueryData.page = 1;
    subQueryData.size = $(this).val() ? $(this).val() : 5;
    getSubCategories();
};

$(document).on('change', 'select#sub-sort-by', subSortBy);

$(document).on('change', 'select#sub-page-size', subChangePageSize);

$('#close-sub-alert').on('click', clearSubAlert);
