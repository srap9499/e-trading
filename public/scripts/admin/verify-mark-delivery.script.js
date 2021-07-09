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
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    }
    $('#orderId, #email. #otp').removeClass('is-invalid');
    $('div#orderId, div#email, div#otp').detach();
};

const errorAlert = (message={}, errors={}) => {
    clearAlert();
    if (message.body) {
        $('#alert div').append(message.body);
        $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    }
    if (errors.orderId) {
        $('input#orderId').addClass('is-invalid');
        $('div#orderId').detach();
        $(`<div id="orderId" class="invalid-feedback"></div>`).insertAfter('input#orderId').text(errors.orderId);
    } else {
        $('input#orderId').removeClass('is-invalid');
        $('div#orderId.invalid-feedback').detach();            
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
    if (errors.otp) {
        $('input#otp').addClass('is-invalid');
        $('div#otp').detach();
        $(`<div id="otp" class="invalid-feedback"></div>`).insertAfter('input#otp').text(errors.otp);
    } else {
        $('input#otp').removeClass('is-invalid');
        $('div#otp.invalid-feedback').detach();            
    }
};

const getDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/order/markdelivery/getdetails',
        beforeSend: () => {
            $('input#orderId, input#email').val('');
            $('#verify-mark-delivery-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data: order={} } = response;
            if (order.id && order.email) {
                id = order.id;
                $('input#orderId').val(order.id);
                $('input#email').val(order.email);
            }
            $('#verify-mark-delivery-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
};

const putVerifyMarkDelivery = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/order/${id}/markdelivery`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#verify-mark-delivery-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#verify-mark-delivery-btn').removeAttr('disabled');
        }
    });
};

const backToOrders = () => {
    window.location.href = '/admin/orders/indelivery';
};

const onReady = () => {
    getDetails();
    $('form#mark-delivery-form').on('submit', putVerifyMarkDelivery);
    $('#back-to-orders-btn').on('click', backToOrders);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);