let queryData = {
    status: $('#status').val() ? $('#status').val() : '',
    sortBy: $('#sort-by').val() ? $('#sort-by').val() : 'date',
    orderBy: $('#order-by').val() ? $('#order-by').val() : 'DESC',
};

const getData = () => {
    $.ajax({
        type: 'GET',
        url: '/cart/products',
        data: queryData,
        success: (response) => {
            const { cartItems } = response;
            if (!cartItems || !cartItems.length) {
                $('#nothing-to-display').removeAttr('hidden');
                $('#cart-area, #checkout-area').attr('hidden', 'true');
                return $('#cart-area, #checkout-area').empty();
            }
            $('#nothing-to-display').attr('hidden', 'true');
            $('#cart-area, #checkout-area').removeAttr('hidden');
            $('#cart-area, #checkout-area').empty();

            const totalItems = cartItems.length;
            let totalAmount = 0;
            let isDisabled = '';
            $.each(cartItems, (i, item) => {
                let {quantity, product, subTotal } = item;
                let { id, name, quantity: stock, brand, category, subcategory, price } = product;
                totalAmount += parseFloat(subTotal);
                brand = brand ? `By&nbsp;${brand.name}` : '';
                const categoryRow = category 
                                        ? `<p class="detail-title">
                                                <span>
                                                    ${category.category}
                                                </span>
                                            </p>` : '';
                const subcategoryRow = subcategory 
                                        ? `<p class="detail-title">
                                                <span>
                                                    ${subcategory.subcategory}
                                                </span>
                                            </p>` : '';
                let updateQuantityOptions = '';
                for (let Qty = 1; Qty <= 20 && Qty <= stock; Qty++) {
                    updateQuantityOptions += `<option value=${Qty}>${Qty}</option>`;
                }
                if (stock < quantity) {
                    isDisabled = 'disabled';
                }
                stock = stock > 0 ? stock : 'Out of stock!';
                const productRow = `<div class="col-12 col-sm-12 col-md-12">
                    <div class="row product-items">
                        <div class="col-12 col-sm-12 col-md-6">
                            <div class="product-head">
                                <h5>
                                    ${name}
                                </h5>
                                <h6>
                                    ${brand}
                                </h6>
                            </div>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3">
                            <ul class="product-details">
                                <li>
                                    ${categoryRow}
                                    ${subcategoryRow}
                                </li>
                                <li>
                                    <p class="detail-title">Price: &nbsp;</p>
                                    <span>&#8377; ${price}</span>
                                </li>
                                <li>
                                    <p class="detail-title">Quantity Left: &nbsp;</p>
                                    <span>${stock}</span>
                                </li>
                                <li>
                                    <p class="detail-title">Qty: &nbsp;</p>
                                    <span>${quantity}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3">
                            <ul class="cart-details">
                                <li>
                                    <h6 for="quantity${id}" class="detail-title" style="display: inline-flex;">
                                        Update Qty: &nbsp;
                                    </h6>
                                    <select name="quantity${id}" id="quantity${id}" class="form-control cart-update-select" style="display: inline-flex; width: max-content;">
                                        <option value=${quantity} selected hidden>${quantity}</option>
                                        <option value=0>0 (Remove)</option>
                                        ${updateQuantityOptions}
                                    </select>
                                </li>
                                <li>
                                    <h6 class="sub-total">Sub Total: &nbsp;</h6>
                                    <span><h6 class="sub-total">&#8377; ${subTotal}</h6></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>`;

                $('#cart-area').append(productRow);

                // On change event update cart
                $(document).on('change', `select#quantity${id}`, () => {
                    $.ajax({
                        type: 'POST',
                        url: `/cart/update/${id}`,
                        data: {
                            quantity: parseInt($(`select#quantity${id}`).val()) ?? 1
                        },
                        success: (response) => {
                            getData();
                            const { message } = response;
                            if (message && message.type === 'success' && message.body) {
                                $(`#alert`)
                                    .empty()
                                    .removeClass('alert-danger')
                                    .addClass('alert-success')
                                    .removeAttr('hidden')
                                    .append(message.body);
                            }
                            setTimeout(() => {
                                $(`#alert`)
                                .empty()
                                .removeClass('alert-danger, alert-success')
                                .attr('hidden', 'true');
                            }, 10000);
                        },
                        error: errorResponse => {
                            const { status, responseJSON: { message } } = errorResponse;
                            if (message && message.type === 'error' && message.body) {
                                $(`#alert`)
                                    .empty()
                                    .addClass('alert-danger')
                                    .removeClass('alert-success')
                                    .removeAttr('hidden')
                                    .append(message.body);
                            }
                            setTimeout(() => {
                                $(`#alert`)
                                .empty()
                                .removeClass('alert-danger, alert-success')
                                .attr('hidden', 'true');
                            }, 10000);
                        }
                    });
                });
            });

            const checkoutRow = `
                <div class="col-12 col-12 col-md-6 text-center">
                    <h6 class="detail-title">Total(${totalItems} items): &nbsp;</h6>
                    <h6>&#8377; ${totalAmount}</h6>
                </div>
                <div class="col-12 col-sm-12 col-md-6">
                    <button type="button" id="check-out-btn" class="btn btn-check-out btn-block" ${isDisabled}>Proceed to Checkout</button>
                </div>`;

            $('#checkout-area').append(checkoutRow);

            if (!isDisabled ) {
                $(document).on('click', '#check-out-btn', () => {
                    $.ajax({
                        type: 'GET',
                        url: '/cart/checkout',
                        success: response => {
                            const { id } = response;
                            console.log(response);
                            window.location.href = `/cart/checkout/${id}/status`;
                        },
                        error: errorResponse => {
                            console.log(errorResponse);
                        }
                    });
                });
            }
        },
        error: errorResponse => {
            const { status, responseJSON: { message } } = errorResponse;
            if (message && message.type === 'error' && message.body) {
                $(`#alert`)
                    .empty()
                    .addClass('alert-danger')
                    .removeClass('alert-success')
                    .removeAttr('hidden')
                    .append(message.body);
            }
            setTimeout(() => {
                $(`#alert`)
                .empty()
                .removeClass('alert-danger, alert-success')
                .attr('hidden', 'true');
            }, 10000);
        }

    });
};

$(document).ready(getData);