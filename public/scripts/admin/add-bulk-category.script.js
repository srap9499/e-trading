'use strict';


const clearBulkAlert = () => {
    $('#bulk-alert div').empty();
    $('#bulk-alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successBulkAlert = (message={}) => {
    clearBulkAlert();
    $('#bulk-alert div').append(message.body);
    $('#bulk-alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    $('input#bulk_category').removeClass('is-invalid');
    $('div#bulk_category.invalid-feedback').detach();
};

const errorBulkAlert = (message={}, errors={}) => {
    clearBulkAlert();
    $('#bulk-alert div').append(message.body);
    $('#bulk-alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    if (errors.categories_category_unique) {
        errors.bulk_category = "Category Must be unique!";
    }
    if (errors.subcategories_subcategory_category_id) {        
        errors.bulk_category = "Sub Category Must be unique in same Category!";
    }
    if (errors.bulk_category) {
        $('#bulk_category').addClass('is-invalid');
        $('div#bulk_category.invalid-feedback').detach();
        $(`<div id="bulk_category" class="invalid-feedback"></div>`).insertAfter('input#bulk_category').text(errors.bulk_category);
    } else {
        $('input#bulk_category').removeClass('is-invalid');
        $('div#bulk_category.invalid-feedback').detach();
    }
};

const addBulkCategory = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/category/add/bulk',
        data: new FormData(this),
        contentType: false,
        processData: false,
        beforeSend: () => {
            $('#add-bulk-category-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successBulkAlert(message);
            $('#add-bulk-category-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorBulkAlert(message, errors);
            $('#add-bulk-category-btn').removeAttr('disabled');
        }
    });
};

const onReady = () => {
    $('form#bulk-category-form').on('submit', addBulkCategory);
    $('#close-bulk-alert').on('click', clearBulkAlert);
};

$(document).ready(onReady);


