let queryData = {
    status: $('#status').val() ? $('#status').val() : '',
    sortBy: $('#sort-by').val() ? $('#sort-by').val() : 'date',
    orderBy: $('#order-by').val() ? $('#order-by').val() : 'DESC',
    page: 1,
    size: $('#page-size').val() ? $('#page-size').val() : 5,
};

const createPagination = (totalPages) => {
    let pageIndex = '<li class="page-item"><a class="page-link">Previous</a></li>';
    $('ul.pagination').append(pageIndex);

    for (let i = 1; i <= totalPages; i++) {
        if (i == queryData.page) {
            pageIndex = `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            pageIndex = `<li class="page-item"><a class="page-link">${i}</a></li>`;
        }
        $('ul.pagination').append(pageIndex);
    }

    pageIndex = '<li class="page-item"><a class="page-link">Next</a></li>';
    $('ul.pagination').append(pageIndex);
};

const getData = () => {
    $.ajax({
        type: 'GET',
        url: '/home/products',
        data: queryData,
        success: (response) => {
            const { products, totalPages } = response;
            if (!products || !products.length) {
                if ($('ul.pagination li').length != totalPages) {
                    $('ul.pagination').empty();
                }
                $('#nothing-to-display').removeAttr('hidden');
                $('#products-area').attr('hidden', 'true');
                return $('#products-area').empty();
            }
            $('#nothing-to-display').attr('hidden', 'true');
            $('#products-area').removeAttr('hidden');
            $('#products-area').empty();

            $.each(products, (i, product) => {
                let { id, name, brand, category, subcategory, price, imagePath } = product;
                brand = brand ? `By&nbsp;${brand.name}` : '';
                category = category ? category.category : '';
                subcategory = subcategory ? subcategory.subcategory : '';
                const isDisabled = product.quantity < 1 ? 'disabled' : '';
                const stock = product.quantity > 0 ? product.quantity : 'Out of stock!';
                let quantityOptions = '';
                for (let Qty = 1; Qty <= 20 && Qty <= product.quantity; Qty++) {
                    quantityOptions += `<option value=${Qty}>${Qty}</option>`;
                }
                const productRow = `<div class="col-12 col-sm-12 col-md-12">
                    <div class="row product-items">
                        <div class="col-12 col-sm-12 col-md-4">
                            <img src="${imagePath}" alt="product" class="img-responsive">
                        </div>
                        <div class="col-12 col-sm-12 col-md-8">
                            <div class="product-head">
                                <h5>
                                    ${name}
                                </h5>
                                <h6>
                                    ${brand}
                                </h6>
                            </div>
                            <ul class="product-details">
                                <li>
                                    <p class="detail-title">
                                        <span>
                                            ${category}
                                        </span>
                                    </p>
                                    <p class="detail-title">
                                        <span>
                                            ${subcategory}
                                        </span>
                                    </p>
                                </li>
                                <li>
                                    <p class="detail-title">Price: &nbsp;</p>
                                    <span>&#8377; ${price}</span>
                                </li>
                                <li>
                                    <p class="detail-title">Quantity Left: &nbsp;</p>
                                    <span>${stock}</span>
                                </li>
                            </ul>
                            <div class="row">
                                <div class="col-6 col-sm-6 col-md-3">
                                    <label for="quantity${id}" style="display: inline-flex;">
                                        Qty: &nbsp;
                                    </label>
                                    <select name="quantity${id}" id="quantity${id}" class="form-control" style="display: inline-flex; width: max-content;" ${isDisabled}>
                                        <option value=1 selected hidden>1</option>
                                        ${quantityOptions}
                                    </select>
                                </div>
                                <div class="col-6 col-sm-6 col-md-3">
                                    <button type="button" id="add-to-cart-${id}" class="btn btn-add-to-cart btn-block" ${isDisabled}>Add To Cart</button>
                                </div>
                                <div class="col-12 col-sm-12 col-md-6">
                                    <div id="alert${id}" class="alert" role="alert" hidden>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                $('#products-area').append(productRow);

                // On click event add to cart
                $(`button#add-to-cart-${id}`).on('click', () => {
                    $.ajax({
                        type: 'POST',
                        url: `/cart/add/${id}`,
                        data: {
                            quantity: parseInt($(`select#quantity${id}`).val()) ?? 1
                        },
                        success: (response) => {
                            const { message } = response;
                            if (message && message.type === 'success' && message.body) {
                                $(`#alert${id}`)
                                    .empty()
                                    .removeClass('alert-danger')
                                    .addClass('alert-success')
                                    .removeAttr('hidden')
                                    .append(message.body);
                                return;
                            }
                            $(`#alert${id}`)
                                    .empty()
                                    .removeClass('alert-danger')
                                    .removeClass('alert-success')
                                    .attr('hidden', 'true');
                        },
                        error: (error) => {
                            const { status, responseJSON: { message } } = error;
                            if (message && message.type === 'error' && message.body) {
                                $(`#alert${id}`)
                                    .empty()
                                    .addClass('alert-danger')
                                    .removeClass('alert-success')
                                    .removeAttr('hidden')
                                    .append(message.body);
                                return;
                            }
                            $(`#alert${id}`)
                                    .empty()
                                    .removeClass('alert-danger')
                                    .removeClass('alert-success')
                                    .attr('hidden', 'true');
                        }
                    });
                });
            });

            if ($('ul.pagination li').length - 2 != totalPages) {
                $('ul.pagination').empty();
                createPagination(totalPages);
            }
        }

    });
};

const paginate = function () {
    let val = $(this).text();

    if (val.toUpperCase()==="NEXT") {
        console.log("next");
        let totalPage = $('ul.pagination li').length - 2;
        if (queryData.page < totalPage) {
            queryData.page += 1;
            let currentActive = $('ul.pagination li.active');
            getData();
            $('ul.pagination li.active').removeClass('active');
            currentActive.next().addClass('active');
        }
        return;
    }
    if (val.toUpperCase()==="PREVIOUS") {
        if (queryData.page > 1) {
            queryData.page -= 1;
            let currentActive = $('ul.pagination li.active');
            getData();
            $('ul.pagination li.active').removeClass('active');
            currentActive.prev().addClass('active');
        }
        return;
    }
    queryData.page = +val;
    getData();
    $('ul.pagination li.active').removeClass('active');
    $(this).parent().addClass('active');
};


$(document).ready( getData );

$(document).on('click', 'ul.pagination li a', paginate);