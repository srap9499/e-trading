//  Function to get wallet amount
const getWalletAmount = async () => {
    $.get({
        url: '/user/wallet/amount',
        success: async (response) => {
            const { data: walletdata={} } = response;
            $('#display-amount').val(walletdata.amount);
        }
    });
};

// Get wallet amount on document ready
$(document).ready(getWalletAmount);

// Display alert based on response


const displayResponseAlert = async (body) => {
    const { message, errors } = body;
    if (message && message.body) {
        $('#alert').removeAttr("hidden").text(message.body);
        if (message.type === "error") {
            $('#alert').addClass("alert-danger").removeClass("alert-success");
        } else {
            $('#alert').addClass("alert-success").removeClass("alert-danger");
        }
    } else {
        $('#alert').attr("hidden", "true");
    }
    if (errors && errors.amount) {
        $('#amount').addClass('is-invalid');
    } else {
        $('#amount').removeClass('is-invalid');
    }
};

const displayValidateAlert = async (body) => {
    const { message, errors } = body.responseJSON;
    if (message && message.body) {
        $('#alert').removeAttr("hidden").text(message.body);
        if (message.type === "error") {
            $('#alert').addClass("alert-danger").removeClass("alert-success");
        } else {
            $('#alert').addClass("alert-success").removeClass("alert-danger");
        }
    } else {
        $('#alert').attr("hidden", "true");
    }
    if (errors && errors.amount) {
        $('#amount').addClass('is-invalid');
        $('div#amount.invalid-feedback').detach();
        $(`<div id="amount" class="invalid-feedback"></div>`).insertAfter('input#amount').text(errors.amount);
    } else {
        $('#amount').removeClass('is-invalid');
        $('div#amount.invalid-feedback').detach();
    }
};


// Add amount to wallet on click add button

$('#add-amount').on('click', (event) => {
    event.preventDefault();
    $.post('/user/wallet/addamount', { amount: $('#amount').val() }, (body) => {
        getWalletAmount();
    })
        .done(displayResponseAlert)
        .fail(displayValidateAlert);
});