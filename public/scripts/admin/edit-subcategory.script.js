'use strict';

let id, categoryId, category;

const clearAlert = () => {
    $('#alert div').empty();
    $('#alert')
        .attr('hidden', 'true')
        .removeClass('alert-success alert-danger');
};

const successAlert = (message = {}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-success');
    $('select#categoryId, input#subcategory').removeClass('is-invalid');
    $('div#categoryId, div#subcategory').detach();
};

const errorAlert = (message = {}, errors = {}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
        .removeAttr('hidden')
        .addClass('alert-danger');
    if (errors.categoryId) {
        $('#categoryId').addClass('is-invalid');
        $('div#categoryId.invalid-feedback').detach();
        $(`<div id="categoryId" class="invalid-feedback"></div>`).insertAfter('select#categoryId').text(errors.categoryId);
    } else {
        $('select#categoryId').removeClass('is-invalid');
        $('div#categoryId.invalid-feedback').detach();
    }
    if (errors.subcategories_subcategory_category_id) {
        errors.subcategory = "Sub Category Already Exists!";
    }
    if (errors.subcategory) {
        $('#subcategory').addClass('is-invalid');
        $('div#subcategory.invalid-feedback').detach();
        $(`<div id="subcategory" class="invalid-feedback"></div>`).insertAfter('input#subcategory').text(errors.subcategory);
    } else {
        $('input#subcategory').removeClass('is-invalid');
        $('div#subcategory.invalid-feedback').detach();
    }
};

const getDetails = async () => {
    await $.ajax({
        type: 'GET',
        url: '/admin/subcategory/edit/getdetails',
        beforeSend: () => {
            $('#edit-subcategory-btn').attr('disabled', 'true');
        },
        success: response => {
            const { data } = response;
            if (data.id && data.subcategory) {
                id = data.id;
                if (data.category) {
                    categoryId = data.category.id;
                    category = data.category.category;
                }
                $('#current_category').val(data.category.category);
                $('#current_subcategory').val(data.subcategory);
            }
            $('#edit-subcategory-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorAlert(message, errors);
        }
    });
};

const getCategoryList = async (categoryOption) => {;
    await $.ajax({
        type: 'GET',
        url: '/admin/categories/list',
        success: response => {
            const {data: categories} = response;
            
            $.each(categories, (i, item) => {
                const { id, category } = item;
                const optionRow = `<option value=${id}>${category}</option>`;
                categoryOption += optionRow;
            });
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorSubAlert(message, errors);
        }
    });
    return categoryOption;
};

const generateOptions = async () => {
    let categoryOption = '<option value="">Select Category&mldr;</option>';

    categoryOption += `<option value=${categoryId} selected hidden>${category}</options>`;

    categoryOption = await getCategoryList(categoryOption);

    $('#categoryId').empty().append(categoryOption);
};

const editSubCategory = function (event) {
    if (!id) {
        return;
    }
    event.preventDefault();
    $.ajax({
        type: 'PUT',
        url: `/admin/subcategory/${id}/edit`,
        data: $(this).serialize(),
        beforeSend: () => {
            $('#edit-subcategory-btn').attr('disabled', 'true');
        },
        success: async response => {
            const { message } = response;
            successAlert(message);
            $('#edit-subcategory-btn').removeAttr('disabled');
            await getDetails();
            await generateOptions();
        },
        error: response => {
            const { responseJSON: { message, errors } } = response;
            errorAlert(message, errors);
            $('#edit-subcategory-btn').removeAttr('disabled');
        }

    });
};
const cancelEdit = () => {
    window.location.href = '/admin/categories';
};

const onReady = async () => {
    $('#current_category, #current_subcategory').attr('disabled', 'true');
    await getDetails();
    await generateOptions();
    $('form#subcategory-form').on('submit', editSubCategory);
    $('#cancel-edit-btn').on('click', cancelEdit);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);


