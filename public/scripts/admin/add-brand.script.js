'use strict';


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
    $('input#name').removeClass('is-invalid');
    $('div#name.invalid-feedback').detach();
};

const errorAlert = (message={}, errors={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger');
    if (errors.name) {
        $('#name').addClass('is-invalid');
        $('div#name.invalid-feedback').detach();
        $(`<div id="name" class="invalid-feedback"></div>`).insertAfter('input#name').text(errors.name);
    } else {
        $('input#name').removeClass('is-invalid');
        $('div#name.invalid-feedback').detach();
    }
};

const addBrand = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/brand/add',
        data: $(this).serialize(),
        beforeSend: () => {
            $('#add-brand-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#add-brand-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            console.log(response.responseJSON);
            errorAlert(message, errors);
            $('#add-brand-btn').removeAttr('disabled');
        }

    });
};

$(document).ready(() => {
    $('form#brand-form').on('submit', addBrand);
});


$('#close-alert').on('click', clearAlert);
