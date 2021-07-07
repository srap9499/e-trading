'use strict';

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
        .attr('hidden', true)
        .removeClass('alert-success alert-danger');
};

const successAlert = (message={}) => {
    clearAlert();
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    }
    $('#userName, #email').removeClass('is-invalid');
    $('div#userName, div#email').detach();
};

const errorAlert = (message={}, errors={}) => {
    clearAlert();
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    }
    if (errors.userName) {
        $('input#userName').addClass('is-invalid');
        $('div#userName').detach();
        $(`<div id="userName" class="invalid-feedback"></div>`).insertAfter('input#userName').text(errors.userName);
    } else {
        $('input#userName').removeClass('is-invalid');
        $('div#userName.invalid-feedback').detach();            
    }
    if (errors.users_email_unique) {
        errors.email = "Email Id Already Exists!";
    }
    if (errors.email) {
        $('input#email').addClass('is-invalid');
        $('div#email').detach();
        $(`<div id="email" class="invalid-feedback"></div>`).insertAfter('input#email').text(errors.email);
    } else {
        $('input#email').removeClass('is-invalid');
        $('div#email.invalid-feedback').detach();            
    }
};

const getDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/profile/get',
        beforeSend: () => {
            $('input#userName, input#email').val('');
            $('#edit-profile-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data: user={} } = response;
            if (user.userName && user.email) {
                $('input#userName').val(user.userName);
                $('input#email').val(user.email);
            }
            $('#edit-profile-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
};

const putEditProfile = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: '/admin/profile/edit',
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-profile-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#edit-profile-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#edit-profile-btn').removeAttr('disabled');
        }
    });
};

const cancelEdit = () => {
    window.location.href = '/admin';
};

const onReady = () => {
    getDetails();
    $('form#profile-form').on('submit', putEditProfile);
    $('#close-alert').on('click', clearAlert);
    $('#cancel-edit-btn').on('click', cancelEdit);
};

$(document).ready(onReady);