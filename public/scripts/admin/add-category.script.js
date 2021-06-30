'use strict';


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
    if (errors.category) {
        $('#category').addClass('is-invalid');
        $('div#category.invalid-feedback').detach();
        $(`<div id="category" class="invalid-feedback"></div>`).insertAfter('input#category').text(errors.category);
    } else {
        $('input#category').removeClass('is-invalid');
        $('div#category.invalid-feedback').detach();
    }
};

const postAddCategory = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/category/add',
        data: $(this).serialize(),
        beforeSend: () => {
            $('#add-category-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#add-category-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            console.log(errors);
            errorAlert(message, errors);
            $('#add-category-btn').removeAttr('disabled');
        },
    });
};

const onReady = () => {
    $('form#category-form').on('submit', postAddCategory);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);