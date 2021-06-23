'use strict';


const postformSuccessAlert = (message={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-danger')
        .addClass('alert-success');
    $('input#userName, input#email, input#password, input#confirm_password').removeClass('is-invalid');
    $('div#userName.invalid-feedback, div#email.invalid-feedback, div#password.invalid-feedback, div#confirm_password.invalid-feedback').detach();
}

const postformErrorAlert = (message={}, errors={}) => {
    $('#alert div').empty()
        .append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger');
    if (errors && errors.userName) {
        $('#userName').addClass('is-invalid');
        $('div#userName.invalid-feedback').detach();
        $(`<div id="userName" class="invalid-feedback"></div>`).insertAfter('input#userName').text(errors.userName);
    } else {
        $('#userName').removeClass('is-invalid');
        $('div#userName.invalid-feedback').detach();
    }
    if (errors && errors.email) {
        $('#email').addClass('is-invalid');
        $('div#email.invalid-feedback').detach();
        $(`<div id="email" class="invalid-feedback"></div>`).insertAfter('input#email').text(errors.email);
    } else {
        $('#email').removeClass('is-invalid');
        $('div#email.invalid-feedback').detach();
    }
    if (errors && errors.password) {
        $('#password').addClass('is-invalid');
        $('div#password.invalid-feedback').detach();
        $(`<div id="password" class="invalid-feedback"></div>`).insertAfter('input#password').text(errors.password);
    } else {
        $('#password').removeClass('is-invalid');
        $('div#password.invalid-feedback').detach();
    }
    if (errors && errors.confirm_password) {
        $('#confirm_password').addClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
        $(`<div id="confirm_password" class="invalid-feedback"></div>`).insertAfter('input#confirm_password').text("Password does not match!");
    } else {
        $('#confirm_password').removeClass('is-invalid');
        $('div#confirm_password.invalid-feedback').detach();
    }
}

const postform = () => {
    console.log('request handler');
    $.ajax({
        type: 'POST',
        url: '/admin/addsubadmin',
        data: {
            userName: $('#userName').val(),
            email: $('#email').val(),
            password: $('#password').val(),
            confirm_password: $('#confirm_password').val()
        },
        success: response => {
            const { message } = response;
            postformSuccessAlert(message);
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            postformErrorAlert(message, errors);
        }
    });
}

$('#add-sub-admin-btn').on('click', postform);