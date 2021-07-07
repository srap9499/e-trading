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
    $('input#bulk_product').removeClass('is-invalid');
    $('div#bulk_product.invalid-feedback').detach();
};

const errorBulkAlert = (message={}, errors={}) => {
    clearBulkAlert();
    $('#bulk-alert div').append(message.body);
    $('#bulk-alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    // if (errors.categories_category_unique) {
    //     errors.bulk_product = "Product Must be unique!";
    // }
    if (errors.products_name_brand_id) {        
        errors.bulk_product = "Product Must be unique!";
    }
    if (errors.bulk_product) {
        $('#bulk_product').addClass('is-invalid');
        $('div#bulk_product.invalid-feedback').detach();
        $(`<div id="bulk_product" class="invalid-feedback"></div>`).insertAfter('input#bulk_product').text(errors.bulk_product);
    } else {
        $('input#bulk_product').removeClass('is-invalid');
        $('div#bulk_product.invalid-feedback').detach();
    }
};

const addBulkProduct = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/product/add/bulk',
        data: new FormData(this),
        contentType: false,
        processData: false,
        beforeSend: () => {
            $('#add-bulk-product-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successBulkAlert(message);
            $('#add-bulk-product-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorBulkAlert(message, errors);
            $('#add-bulk-product-btn').removeAttr('disabled');
        }
    });
};

const onReady = () => {
    $('form#bulk-product-form').on('submit', addBulkProduct);
    $('#close-bulk-alert').on('click', clearBulkAlert);
};

$(document).ready(onReady);


