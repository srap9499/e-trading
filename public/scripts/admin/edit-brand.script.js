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
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    $('input#name').removeClass('is-invalid');
    $('div#name.invalid-feedback').detach();
};

const errorAlert = (message={}, errors={}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    if (errors.brand_name_unique) {
        errors.name = "Brand already Exists!"
    }
    if (errors.name) {
        $('#name').addClass('is-invalid');
        $('div#name.invalid-feedback').detach();
        $(`<div id="name" class="invalid-feedback"></div>`).insertAfter('input#name').text(errors.name);
    } else {
        $('input#name').removeClass('is-invalid');
        $('div#name.invalid-feedback').detach();
    }
};

const getDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/admin/brand/edit/getdetails',
        beforeSend: () => {
            $('#edit-brand-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data } = response;
            if (data.id && data.name)  {
                id = data.id;
                $('#current_name').val(data.name);
            }
            $('#edit-brand-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            console.log(message);
            errorAlert(message, errors);
        }
    });
};

const editBrand = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/brand/${id}/edit`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-brand-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            $('#edit-brand-btn').removeAttr('disabled');
            getDetails();
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            console.log(response.responseJSON);
            errorAlert(message, errors);
            $('#edit-brand-btn').removeAttr('disabled');
        }

    });
};
const cancelEdit = () => {
    window.location.href = '/admin/brands';
};

const onReady = () => {
    $('#current_name').attr('disabled', 'true');
    getDetails();
    $('form#brand-form').on('submit', editBrand);
    $('#cancel-edit-btn').on('click', cancelEdit);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);


