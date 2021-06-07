//  Function to get wallet amount
const getWalletAmount = async () => {
    $.get({
        url: '/user/wallet/amount',
        success: async (response) => {
            $('#display-amount').val(response.wallet.amount);
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
        $('#alert').addAttr("hidden");
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
        $('#alert').addAttr("hidden");
    }
    if (errors && errors.amount) {
        $('#amount').addClass('is-invalid');
    } else {
        $('#amount').removeClass('is-invalid');
    }
};


// Add amount to wallet on click add button

const submitForm = () => {
    console.log("ready");
    $('#add-amount').on('click', (event) => {
        event.preventDefault();
        console.log("submit");
        $.post('/user/wallet/addamount', { amount: $('#amount').val() }, (body) => {
            getWalletAmount();
        })
            .done(displayResponseAlert)
            .fail(displayValidateAlert);
    });
};
$(document).ready(submitForm);