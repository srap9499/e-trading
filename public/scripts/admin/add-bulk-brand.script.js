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
    $('input#bulk_brand').removeClass('is-invalid');
    $('div#bulk_brand.invalid-feedback').detach();
};

const errorBulkAlert = (message={}, errors={}) => {
    clearBulkAlert();
    $('#bulk-alert div').append(message.body);
    $('#bulk-alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    if (errors.brands_name_unique) {
        errors.bulk_brand = "Brand Name Must be unique";
    }
    if (errors.bulk_brand) {
        $('#bulk_brand').addClass('is-invalid');
        $('div#bulk_brand.invalid-feedback').detach();
        $(`<div id="bulk_brand" class="invalid-feedback"></div>`).insertAfter('input#bulk_brand').text(errors.bulk_brand);
    } else {
        $('input#bulk_brand').removeClass('is-invalid');
        $('div#bulk_brand.invalid-feedback').detach();
    }
};

const addBulkBrand = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/brand/add/bulk',
        data: new FormData(this),
        contentType: false,
        processData: false,
        beforeSend: () => {
            $('#add-bulk-brand-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successBulkAlert(message);
            $('#add-bulk-brand-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorBulkAlert(message, errors);
            $('#add-bulk-brand-btn').removeAttr('disabled');
        }
    });
};

const onReady = () => {
    $('form#bulk-brand-form').on('submit', addBulkBrand);
    $('#close-bulk-alert').on('click', clearBulkAlert);
};

$(document).ready(onReady);


