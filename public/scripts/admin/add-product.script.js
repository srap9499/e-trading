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
    $(`#name, #description, #product_image, #quantity,
        #price, #brandId, #categoryId, #subcategoryId`).removeClass('is-invalid');
    $(`div#name, div#description, div#product_image, div#quantity,
        div#price, div#brandId, div#categoryId, div#subcategoryId`).detach();
};

const errorAlert = (message={}, errors={}) => {
    clearAlert();
    $('#alert div').append(message.body);
    $('#alert')
    .removeAttr('hidden')
    .addClass('alert-danger');
    if (errors.products_name_brand_id) {
        errors.name = "Product with same name & brand already exists!"
    }
    if (errors.name) {
        $('#name').addClass('is-invalid');
        $('div#name.invalid-feedback').detach();
        $(`<div id="name" class="invalid-feedback"></div>`).insertAfter('input#name').text(errors.name);
    } else {
        $('input#name').removeClass('is-invalid');
        $('div#name.invalid-feedback').detach();
    }
    if (errors.description) {
        $('#description').addClass('is-invalid');
        $('div#description.invalid-feedback').detach();
        $(`<div id="description" class="invalid-feedback"></div>`).insertAfter('textarea#description').text(errors.description);
    } else {
        $('textarea#description').removeClass('is-invalid');
        $('div#description.invalid-feedback').detach();
    }
    if (errors.product_image) {
        $('#product_image').addClass('is-invalid');
        $('div#product_image.invalid-feedback').detach();
        $(`<div id="product_image" class="invalid-feedback"></div>`).insertAfter('input#product_image').text(errors.product_image);
    } else {
        $('input#product_image').removeClass('is-invalid');
        $('div#product_image.invalid-feedback').detach();
    }
    if (errors.quantity) {
        $('#quantity').addClass('is-invalid');
        $('div#quantity.invalid-feedback').detach();
        $(`<div id="quantity" class="invalid-feedback"></div>`).insertAfter('input#quantity').text(errors.quantity);
    } else {
        $('input#quantity').removeClass('is-invalid');
        $('div#quantity.invalid-feedback').detach();
    }
    if (errors.price) {
        $('#price').addClass('is-invalid');
        $('div#price.invalid-feedback').detach();
        $(`<div id="price" class="invalid-feedback"></div>`).insertAfter('input#price').text(errors.price);
    } else {
        $('input#price').removeClass('is-invalid');
        $('div#price.invalid-feedback').detach();
    }
    if (errors.brandId) {
        $('#brandId').addClass('is-invalid');
        $('div#brandId.invalid-feedback').detach();
        $(`<div id="brandId" class="invalid-feedback"></div>`).insertAfter('select#brandId').text(errors.brandId);
    } else {
        $('select#brandId').removeClass('is-invalid');
        $('div#brandId.invalid-feedback').detach();
    }
    if (errors.categoryId) {
        $('#categoryId').addClass('is-invalid');
        $('div#categoryId.invalid-feedback').detach();
        $(`<div id="categoryId" class="invalid-feedback"></div>`).insertAfter('select#categoryId').text(errors.categoryId);
    } else {
        $('select#categoryId').removeClass('is-invalid');
        $('div#categoryId.invalid-feedback').detach();
    }
    if (errors.subcategoryId) {
        $('#subcategoryId').addClass('is-invalid');
        $('div#subcategoryId.invalid-feedback').detach();
        $(`<div id="subcategoryId" class="invalid-feedback"></div>`).insertAfter('select#subcategoryId').text(errors.subcategoryId);
    } else {
        $('select#subcategoryId').removeClass('is-invalid');
        $('div#subcategoryId.invalid-feedback').detach();
    }
};

const getProduct_previousSelectedBrand = async (brandOption) => {
    await $.ajax({
        type: 'GET',
        url: '/admin/product/previous/brand',
        success: response => {
            const { data: {id, name} } = response;
            const optionRow = `<option value=${id} selected hidden>${name}</option>`;
            brandOption += optionRow;
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
    return brandOption;
};

const getBrandList = async (brandOption) => {
    await $.ajax({
        type: 'GET',
        url: '/admin/brands/list',
        success: response => {
            const { data: brands } = response;
            
            $.each(brands, (i, item) => {
                const { id, name } = item;
                const optionRow = `<option value=${id}>${name}</option>`;
                brandOption += optionRow;
            });
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
    return brandOption;
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
            errorAlert(message, errors);
        }
    });
    return categoryOption;
};

const getSubCategoryList = async (subcategoryOption) => {
    const categoryId = $('#categoryId').val();
    if (!categoryId) {
        return subcategoryOption;
    }
    await $.ajax({
        type: 'GET',
        url: `/admin/categories/${categoryId}/subcategories/list`,
        success: response => {
            const { data: subcategories } = response;

            $.each(subcategories, (i, item) => {
                const { id, subcategory } = item;
                const optionRow = `<option value=${id}>${subcategory}</option>`;
                subcategoryOption += optionRow;
            });
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
        }
    });
    return subcategoryOption;
};

const generateBrandOptions = async () => {
    let brandOption = '<option value="">Select Brand&mldr;</option>';

    brandOption = await getProduct_previousSelectedBrand(brandOption);

    brandOption = await getBrandList(brandOption);

    $('select#brandId').empty().append(brandOption);
};

const generateCategoryOptions = async () => {
    let categoryOption = '<option value="">Select Category&mldr;</option>';

    categoryOption = await getCategoryList(categoryOption);

    $('select#categoryId').empty().append(categoryOption);
};

const generateSubcategoryOptions = async () => {
    let subcategoryOption = '<option value="">Select Sub Category&mldr;</option>';

    subcategoryOption = await getSubCategoryList(subcategoryOption);

    $('select#subcategoryId').empty().append(subcategoryOption);
};

const generateAllOptions = async () => {
    await generateBrandOptions();
    await generateCategoryOptions();
    await generateSubcategoryOptions();
};

const postAddProduct = function (event) {
    event.preventDefault()
    $.ajax({
        type: 'POST',
        url: '/admin/product/add',
        data: new FormData(this),
        contentType: false,
        processData: false,
        beforeSend: () => {
            $('#add-product-btn').attr('disabled', 'true');
        },
        success: response => {
            const { message } = response;
            successAlert(message);
            generateAllOptions();
            $('#add-product-btn').removeAttr('disabled');
        },
        error: response => {
            const { responseJSON: {message, errors} } = response;
            errorAlert(message, errors);
            $('#add-product-btn').removeAttr('disabled');
        }
    });
};

const onReady = () => {
    $('input#product_image').attr('accept', 'image/jpeg');
    generateAllOptions();
    $('#categoryId').on('change', generateSubcategoryOptions);

    $('form#product-form').on('submit', postAddProduct);
    $('#close-alert').on('click', clearAlert);
};

$(document).ready(onReady);