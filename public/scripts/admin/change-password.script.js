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
    $('#password, #new_password, #confirm_password').removeClass('is-invalid');
    $('div#password, div#new_password, div#confirm_password, ').detach();
};

const errorAlert = (message={}, errors={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger');
    if (errors.password) {
        $('#password').addClass('is-invalid');
        $('div#password.invalid-feedback').detach();
        $(`<div id="password" class="invalid-feedback"></div>`).insertAfter('input#password').text(errors.password);
    } else {
        $('input#password').removeClass('is-invalid');
        $('div#password.invalid-feedback').detach();
    }
    if (errors.new_password) {
        $('#new_password').addClass('is-invalid');
        $('div#new_password.invalid-feedback').detach();
        $(`<div id="new_password" class="invalid-feedback"></div>`).insertAfter('input#new_password').text(errors.new_password);
    } else {
        $('input#new_password').removeClass('is-invalid');
        $('div#new_password.invalid-feedback').detach();
    }
    if (errors.confirm_password) {
        errors.confirm_password = "Both Password does not match!";
        $('#confirm_password').addClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
        $(`<div id="confirm_password" class="invalid-feedback"></div>`).insertAfter('input#confirm_password').text(errors.confirm_password);
    } else {
        $('input#confirm_password').removeClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
    }
};

const putChangePassword = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: '/auth/changepassword',
        data: $(this).serialize(),
        beforeSend: () => {
            $('#change-password-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#change-password-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            console.log(errors);
            errorAlert(message, errors);
            $('#change-password-btn').removeAttr('disabled');
        }
    });
};

const onReady = () => {
    $('form#change-password-form').on('submit', putChangePassword);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);