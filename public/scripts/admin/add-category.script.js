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
            generateOptions();
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#add-category-btn').removeAttr('disabled');
        },
    });
};

const clearSubAlert = () => {
    $('#sub-alert div').empty();
    $('#sub-alert')
    .attr('hidden', 'true')
    .removeClass('alert-success alert-danger');
};

const successSubAlert = (message={}) => {
    clearSubAlert();
    $('#sub-alert div').append(message.body);
    $('#sub-alert')
    .removeAttr('hidden')
    .addClass('alert-success');
    $('select#categoryId, input#subcategory').removeClass('is-invalid');
    $('div#categoryId.invalid-feedback, div#sub-category.invalid-feedback').detach();
};

const errorSubAlert = (message={}, errors={}) => {
    clearSubAlert();
    $('#sub-alert div').append(message.body);
    $('#sub-alert')
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

const getCategoryList = async (categoryOption) => {;
    await $.ajax({
        type: 'GET',
        url: '/admin/categories/list',
        success: response => {
            const {data: categories} = response;
            
            $.each(categories, (i, item) => {
                console.log(item);
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
    let categoryOption = '<option>Select Category&mldr;</option>';

    categoryOption = await getCategoryList(categoryOption);

    $('select#categoryId').empty().append(categoryOption);
};

const postAddSubCategory = function (event) {
    event.preventDefault();
    $.ajax({
        type: 'POST',
        url: '/admin/subcategory/add',
        data: $(this).serialize(),
        beforeSend: () => {
            $('#add-sub-category-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            console.log(message);
            successSubAlert(message);
            $('#add-sub-category-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            console.log(errors);
            errorSubAlert(message, errors);
            $('#add-sub-category-btn').removeAttr('disabled');
        },
    });
};

const onReady = () => {
    $('form#category-form').on('submit', postAddCategory);
    $('#close-alert').on('click', clearAlert);

    generateOptions();

    $('form#sub-category-form').on('submit', postAddSubCategory);
    $('#close-sub-alert').on('click', clearSubAlert);
};

$(document).ready(onReady);