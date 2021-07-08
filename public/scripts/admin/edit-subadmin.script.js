'use strict';

let id;

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successAlert = (message = {}) => {
    clearAlert();
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
            .removeAttr('hidden')
            .addClass('alert-success');
    }
    $('#userName, #email, #new_password, #confirm_password').removeClass('is-invalid');
    $('div#userName, div#email, div#new_password, div#confirm_password').detach();
};

const errorAlert = (message = {}, errors = {}) => {
    clearAlert();
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
            .removeAttr('hidden')
            .addClass('alert-danger');
    }
    if (errors.userName) {
        $('input#userName').addClass('is-invalid');
        $('div#userName.invalid-feedback').detach();
        $(`<div id="userName" class="invalid-feedback"></div>`)
            .insertAfter('input#userName').text(errors.userName);
    } else {
        $('input#userName').removeClass('is-invalid');
        $('div#userName.invalid-feedback').detach();
    }
    if (errors.users_email_unique) {
        errors.email = "Email Id Already Exists!";
    }
    if (errors.email) {
        $('input#email').addClass('is-invalid');
        $('div#email.invalid-feedback').detach();
        $(`<div id="email" class="invalid-feedback"></div>`)
            .insertAfter('input#email').text(errors.email);
    } else {
        $('input#email').removeClass('is-invalid');
        $('div#email.invalid-feedback').detach();
    }
    if (errors.new_password) {
        $('input#new_password').addClass('is-invalid');
        $('div#new_password.invalid-feedback').detach();
        $(`<div id="new_password" class="invalid-feedback"></div>`)
            .insertAfter('input#new_password').text(errors.new_password);
    } else {
        $('input#new_password').removeClass('is-invalid');
        $('div#new_password.invalid-feedback').detach();
    }
    if (errors.confirm_password) {
        errors.confirm_password = "Both Password does not match!";
    }
    if (errors.confirm_password) {
        $('input#confirm_password').addClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
        $(`<div id="confirm_password" class="invalid-feedback"></div>`)
            .insertAfter('input#confirm_password').text(errors.confirm_password);
    } else {
        $('input#confirm_password').removeClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
    }
};

const getDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/subadmin/edit/getdetails',
        beforeSend: () => {
            $('input#userName, input#email').val('');
            $('#edit-profile-btn').attr('disabled', 'true');
            $('#change-password-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data: user={} } = response;
            if (user.id && user.userName && user.email) {
                id = user.id;
                $('input#userName').val(user.userName);
                $('input#email').val(user.email);
            }
            $('#edit-profile-btn').removeAttr('disabled');
            $('#change-password-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
};

const putEditProfile = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/subadmin/${id}/edit/profile`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-profile-btn').attr('disabled', 'true');
            $('#change-password-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#edit-profile-btn').removeAttr('disabled');
            $('#change-password-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#edit-profile-btn').removeAttr('disabled');
            $('#change-password-btn').removeAttr('disabled');
        }
    });
};

const putChangePassword = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/subadmin/${id}/edit/password`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-profile-btn').attr('disabled', 'true');
            $('#change-password-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#edit-profile-btn').removeAttr('disabled');
            $('#change-password-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#edit-profile-btn').removeAttr('disabled');
            $('#change-password-btn').removeAttr('disabled');
        }
    });
};

const cancelEdit = () => {
    window.location.href = '/admin/subadmins';
};

const onReady = () => {
    getDetails();
    $('form#profile-form').on('submit', putEditProfile);
    $('form#password-form').on('submit', putChangePassword);
    $('#cancel-edit-profile-btn, #cancel-change-password-btn').on('click', cancelEdit);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);