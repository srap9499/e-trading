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
                $('#cart-area').attr('hidden', 'true');
                return $('#cart-area').empty();
            }
            $('#nothing-to-display').attr('hidden', 'true');
            $('#cart-area').removeAttr('hidden');
            $('#cart-area').empty();

            $.each(cartItems, (i, item) => {
                let {quantity, product } = item;
                let { id, name, quantity: stock, brand, category, subcategory, price } = product;
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
                            </ul>
                        </div>
                        <div class="col-12 col-sm-12 col-md-3">
                            <label for="quantity${id}" style="display: inline-flex;">
                                Qty: &nbsp;
                            </label>
                            <select name="quantity${id}" id="quantity${id}" class="form-control" style="display: inline-flex; width: max-content;">
                                <option value=${quantity} selected hidden>${quantity}</option>
                                <option value=0>0 (Remove)</option>
                                ${updateQuantityOptions}
                            </select>
                        </div>
                    </div>
                </div>`;

                $('#cart-area').append(productRow);

                // On click event add to cart
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
                                .removeClass('alert-danger')
                                .removeClass('alert-success')
                                .attr('hidden', 'true');
                            }, 10000);
                        },
                        error: (error) => {
                            const { status, responseJSON: { message } } = error;
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
                                .removeClass('alert-danger')
                                .removeClass('alert-success')
                                .attr('hidden', 'true');
                            }, 10000);
                        }
                    });
                });
            });
        }

    });
};

$(document).ready(getData);