'use strict';

let curreEntries = 0;

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
    3: ['userName', 'ASC'],
    4: ['userName', 'DESC'],
    5: ['email', 'ASC'],
    6: ['email', 'DESC']
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
            <option class="small" value=1>User Id Asc</option>
            <option class="small" value=2>User Id Desc</option>
            <option class="small" value=3>User Name Asc</option>
            <option class="small" value=4>User Name Desc</option>
            <option class="small" value=5>Email Id Asc</option>
            <option class="small" value=6>Email Id Desc</option>
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
        <table id="sub-admins-table" class="table table-light table-striped table-hover lead">
            <thead class="small border-1">
                <tr>
                    <th scope="col" class="align-middle">U.ID</th>
                    <th scope="col" class="align-middle">User Name</th>
                    <th scope="col" class="align-middle">Email Address</th>
                    <th scope="col" class="align-middle">Action</th>
                </tr>
            </thead>
            <tbody class="small border-1">
            </tbody>
        </table>
    </div>
</div>`;

const restoreSubAdmin = id => {
    return () => {
        $.ajax({
            type: 'PUT',
            url: `/admin/subadmin/${id}/restore`,
            success: response => {
                const { message } = response;
                successAlert(message);
                if (curreEntries <=1 && queryData.page > 1) {
                    queryData.page -= 1;
                }
                getSubAdmins();
            },
            error: response => {
                const { responseJSON: { message } } = response;
                errorAlert(message);
            }
        });
    };
};

const createRow = (rowData) => {
    const { id, userName, email } = rowData;
    const subAdminRow = `
    <tr>
        <td>
            ${id}
        </td>
        <td>
            ${userName}
        </td>
        <td>
            ${email}
        </td>
        <td>
            <i id="restore${id}" class="fas fa-trash-restore" title="Restore Sub Admin"></i>
        </td>
    </tr>`;

    $('#sub-admins-table tbody').append(subAdminRow);

    $(`#restore${id}`).on('click', restoreSubAdmin(id));
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


const getSubAdmins = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/subadmins/trash/get',
        data: queryData,
        success: response => {
            const { data: { rows, totalPages } } = response;
            $('#sub-admins-area').empty();
            if (!rows || !rows.length) {
                curreEntries = rows.length??0;
                if ($('ul.pagination li').length - 2 != totalPages) {
                    $('ul.pagination').empty();
                    $('#options-area').empty();
                }
                $('#sub-admins-area').append(nothingArea);
                return;
            }
            curreEntries = rows.length;

            $('#sub-admins-area').append(tableArea);

            $.each(rows, (i, subAdmin) => {
                createRow(subAdmin);
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

$(document).ready(getSubAdmins);


const paginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getSubAdmins();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getSubAdmins();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = parseInt(val);
    getSubAdmins();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};

$(document).on('click', 'ul.pagination li a', paginate);

const sortBy = function() {
    queryData.order = sortByOptions[$(this).val()]??sortByOptions[1];
    getSubAdmins();
}

const changePageSize = function() {
    queryData.page = 1;
    queryData.size = $(this).val() ? $(this).val() : 5;
    getSubAdmins();
};

$(document).on('change', 'select#sort-by', sortBy);

$(document).on('change', 'select#page-size', changePageSize);

$('#close-alert').on('click', clearAlert);