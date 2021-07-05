'use strict';

let id;

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successAlert = (message={}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    $('input#category').removeClass('is-invalid');
    $('div#category.invalid-feedback').detach();
};

const errorAlert = (message={}, errors={}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    if (errors.categories_category_unique) {
        errors.category = "Category already Exists!"
    }
    if (errors.category) {
        $('#category').addClass('is-invalid');
        $('div#category.invalid-feedback').detach();
        $(`<div id="category" class="invalid-feedback"></div>`).insertAfter('input#category').text(errors.category);
    } else {
        $('input#category').removeClass('is-invalid');
        $('div#category.invalid-feedback').detach();
    }
};

const getDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/category/edit/getdetails',
        beforeSend: () => {
            $('#edit-category-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data } = response;
            if (data.id && data.category)  {
                id = data.id;
                $('#current_category').val(data.category);
            }
            $('#edit-category-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
};

const editCategory = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/category/${id}/edit`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-category-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#edit-category-btn').removeAttr('disabled');
            getDetails();
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorAlert(message, errors);
            $('#edit-category-btn').removeAttr('disabled');
        }

    });
};
const cancelEdit = () => {
    window.location.href = '/admin/categories';
};

const onReady = () => {
    $('#current_category').attr('disabled', 'true');
    getDetails();
    $('form#category-form').on('submit', editCategory);
    $('#cancel-edit-btn').on('click', cancelEdit);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);


