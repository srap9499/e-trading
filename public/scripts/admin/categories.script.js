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

const tableArea = `
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

const editCategory = id => {
    return () => {
        window.location.href = `/admin/category/${id}/edit`;
    };
};

const deleteSubCategory = id => {
    return () => {
        $.ajax({
            type: 'DELETE',
            url: `/admin/subcategory/${id}/delete`,
            success: response => {
                const { message } = response;
                successAlert(message);
                if (currentEntries <=1 && queryData.page > 1) {
                    queryData.page -= 1;
                }
                getCategories();
            },
            error: response => {
                const { responseJSON: { message } } = response;
                errorAlert(message);
            }
        });
    };
};

const deleteCategory = id => {
    return () => {
        $.ajax({
            type: 'DELETE',
            url: `/admin/category/${id}/delete`,
            success: response => {
                const { message } = response;
                successAlert(message);
                if (currentEntries <=1 && queryData.page > 1) {
                    queryData.page -= 1;
                }
                getCategories();
            },
            error: response => {
                const { responseJSON: { message } } = response;
                errorAlert(message);
            }
        });
    };
};

const createRow = (rowData) => {
    const { id, category, subcategories } = rowData;
    let subcategory = '';
    $.each(subcategories, (i, item) => {
        const subcategoryRow = `
        <div class="row gx-1 gy-0">
            <div class="col-2 col-md-1">
                <p class="muted-text small py-0 my-0">${item.id}</p>
            </div>
            <div class="col-7 col-md-8">
                <p class="muted-text small py-0 my-0">${item.subcategory}</p>
            </div>
            <div class="col-3">
                <div class="row gx-3 gy-0 text-center">
                    <div class="col-3 small py-0 my-0">
                        <i id="edit-sub${item.id}" class="fas fa-pencil-alt" title="Edit ${item.subcategory}"></i>
                    </div>
                    <div class="col-3 small py-0 my-0">
                        <i id="delete-sub${item.id}" class="fas fa-trash" title="Delete ${item.subcategory}"></i>
                    </div>
                </div>
            </div>
        </div>`;
        subcategory += subcategoryRow;
        $(document).on('click', `#delete-sub${item.id}`, deleteSubCategory(item.id));
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
            <div class="row gx-4 gy-0 text-center">
                <div class="col-3">
                    <i id="edit${id}" class="fas fa-pencil-alt" title="Edit ${category}"></i>
                </div>
                <div class="col-3">
                    <i id="delete${id}" class="fas fa-trash" title="Delete ${category}"></i>
                </div>
            </div>
        </td>
    </tr>`;

    $('#categories-table tbody').append(categoryRow);

    $(`#edit${id}`).on('click', editCategory(id));
    $(`#delete${id}`).on('click', deleteCategory(id));
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


const getCategories = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/categories/get',
        data: queryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            console.log(rows);
            $('#categories-area').empty();
            if (!rows || !rows.length) {
                currentEntries = rows.length??0;
                if ($('ul.pagination li').length - 2 != totalPages) {
                    $('ul.pagination').empty();
                    $('#options-area').empty();
                }
                $('#categories-area').append(nothingArea);
                return;
            }
            currentEntries = rows.length;

            $('#categories-area').append(tableArea);

            $.each(rows, (i, category) => {
                createRow(category);
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

$(document).ready(getCategories);


const paginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getCategories();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getCategories();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = parseInt(val);
    getCategories();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).on('click', 'ul.pagination li a', paginate);

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