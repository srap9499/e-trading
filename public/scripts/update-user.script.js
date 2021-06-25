'use strict';

const changePassword = () => {
    $.ajax({
        type: 'PUT',
        url: '/auth/changepassword',
        data: {
            password: $('input#password').val(),
            new_password: $('input#new_password').val(),
            confirm_password: $('input#confirm_password').val()
        },
        success: response => {
            const { message } = response;
            $('#alert-change-password')
                .empty()
                .removeAttr('hidden')
                .removeClass('alert-danger')
                .addClass('alert-success')
                .append(message.body);
            $('input#password, input#new_password, input#confirm_password').val('').removeClass('is-invalid');
            $('div#password.invalid-feedback, div#new_password.invalid-feedback, div#confirm_password.invalid-feedback').detach();
        },
        error: body => {
            const { responseJSON: { message, errors } } = body;
            $('#alert-change-password')
                .empty()
                .removeAttr('hidden')
                .removeClass('alert-success')
                .addClass('alert-danger')
                .append(message.body);
            if (errors && errors.password) {
                $('#password').addClass('is-invalid');
                $('div#password.invalid-feedback').detach();
                $(`<div id="password" class="invalid-feedback"></div>`).insertAfter('input#password').text(errors.password);
            } else {
                $('#password').removeClass('is-invalid');
                $('div#password.invalid-feedback').detach();
            }
            if (errors && errors.new_password) {
                $('#new_password').addClass('is-invalid');
                $('div#new_password.invalid-feedback').detach();
                $(`<div id="new_password" class="invalid-feedback"></div>`).insertAfter('input#new_password').text(errors.new_password);
            } else {
                $('#new_password').removeClass('is-invalid');
                $('div#new_password.invalid-feedback').detach();
            }
            if (errors && errors.confirm_password) {
                $('#confirm_password').addClass('is-invalid');
                $('div#confirm_password.invalid-feedback').detach();
                $(`<div id="confirm_password" class="invalid-feedback"></div>`).insertAfter('input#confirm_password').text('Passwords does not match!');
            } else {
                $('#confirm_password').removeClass('is-invalid');
                $('div#confirm_password.invalid-feedback').detach();
            }
        }
    });
};

$('#change-password-btn').on('click', changePassword);

const verifyOtpSuccessAlert = message => {
    $('#alert-user-detail')
        .empty()
        .removeAttr('hidden')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .append(message.body);
    $('input#name, input#email, input#otp').removeClass('is-invalid');
    $('div#name.invalid-feedback, div#email.invalid-feedback, div#otp.invalid-feedback').detach();
};

const verifyOtpErrorAlert = (message, errors) => {
    $('#alert-user-detail')
        .empty()
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .append(message.body);
    if (errors && errors.name) {
        $('#name').addClass('is-invalid');
        $('div#name.invalid-feedback').detach();
        $(`<div id="name" class="invalid-feedback"></div>`).insertAfter('input#name').text(errors.name);
    } else {
        $('#name').removeClass('is-invalid');
        $('div#name.invalid-feedback').detach();
    }
    if (errors && errors.email) {
        $('#email').addClass('is-invalid');
        $('div#email.invalid-feedback').detach();
        $(`<div id="email" class="invalid-feedback"></div>`).insertAfter('input#email').text(errors.email);
    } else {
        $('#email').removeClass('is-invalid');
        $('div#email.invalid-feedback').detach();
    }
    if (errors && errors.otp) {
        $('#otp').addClass('is-invalid');
        $('div#otp.invalid-feedback').detach();
        $(`<div id="otp" class="invalid-feedback"></div>`).insertAfter('input#otp').text(errors.otp);
    } else {
        $('#otp').removeClass('is-invalid');
        $('div#otp.invalid-feedback').detach();
    }
};

const verifyOtp = () => {
    $.ajax({
        type: 'PUT',
        url: '/user/update/userdetails/verify',
        data: {
            name: $('input#name').val(),
            email: $('input#email').val(),
            otp: $('input#otp').val()
        },
        success: response => {
            console.log(response);
            const { message } = response;
            getUserDetails();
            verifyOtpSuccessAlert(message);
        },
        error: body => {
            console.log(body);
            const { responseJSON: { message, errors } } = body;
            verifyOtpErrorAlert(message, errors);
        }
    });
};

const updateUserDetailSuccessAlert = message => {
    $('#alert-user-detail')
        .empty()
        .removeAttr('hidden')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .append(message.body);
    $('input#name, input#email').removeClass('is-invalid');
    $('div#name.invalid-feedback, div#email.invalid-feedback').detach();
};

const updateUserDetailErrorAlert = (message, errors) => {
    $('#alert-user-detail')
        .empty()
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .append(message.body);
    if (errors && errors.name) {
        $('#name').addClass('is-invalid');
        $('div#name.invalid-feedback').detach();
        $(`<div id="name" class="invalid-feedback"></div>`).insertAfter('input#name').text(errors.name);
    } else {
        $('#name').removeClass('is-invalid');
        $('div#name.invalid-feedback').detach();
    }
    if (errors && errors.email) {
        $('#email').addClass('is-invalid');
        $('div#email.invalid-feedback').detach();
        $(`<div id="email" class="invalid-feedback"></div>`).insertAfter('input#email').text(errors.email);
    } else {
        $('#email').removeClass('is-invalid');
        $('div#email.invalid-feedback').detach();
    }
};

const updateUserDetails = () => {
    $.ajax({
        type: 'PUT',
        url: '/user/update/userdetails',
        data: {
            name: $('input#name').val(),
            email: $('input#email').val()
        },
        success: response => {
            console.log(response);
            const { message } = response;
            updateUserDetailSuccessAlert(message);
            $('input#name, input#email').attr('disabled', 'true');
            $('div#otp-field').detach();
            const otpRow = `
            <div id="otp-field" class="col-12 col-sm-12 col-md-3">
                                    <div class="form-group">
                                        <label for="otp">OTP:</label>
                                        <input type="text" id="otp" class="form-control" placeholder="Enter OTP&mldr;">
                                    </div>
                                </div>`;
            $(otpRow).insertAfter('div#email-field');
            const btnRow = `
            <div class="row">
                                <div class="col-6 col-sm-6 col-md-2">
                                    <div class="form-group">
                                        <button type="submit" id="verify-otp-btn" class="btn btn-add-amount btn-block">Verify</button>
                                    </div>
                                </div>
                                <div id="verify-cancel-btn-field" class="col-6 col-sm-6 col-md-2">
                                    <div class="form-group">
                                        <button type="submit" id="cancel-btn" class="btn btn-add-amount btn-block">cancel</button>
                                    </div>
                                </div>
                                <div id="resend-otp-field" class="col-6 col-sm-6 col-md-3" hidden>
                                    <div class="form-group">
                                        <button type="submit" id="resend-otp-btn" class="btn btn-add-amount btn-block" disabled>Resend OTP</button>
                                    </div>
                                </div>
                            </div>`;
            $('#update-user-btn-field').empty().append(btnRow);
            setTimeout(() => {
                $('button#resend-otp-btn').removeAttr('disabled');
                $('div#resend-otp-field').removeAttr('hidden');
            }, 5 * 60 * 1000);  // timeout 5 mins
            $('button#verify-otp-btn').on('click', verifyOtp);
            $('#verify-cancel-btn-field #cancel-btn').on('click', getUserDetails);
        },
        error: body => {
            console.log(body);
            const { responseJSON: { message, errors } } = body;
            updateUserDetailErrorAlert(message, errors);
        }
    });
};

const getUserDetailSuccessAlert = () => {
    $('#alert-user-detail')
        .empty()
        .attr('hidden', 'true')
        .removeClass('alert-danger, alert-success');
    $('input#name, input#email').removeClass('is-invalid');
    $('div#name.invalid-feedback, div#email.invalid-feedback').detach();
}

const getUserDetailErrorAlert = (message) => {
    $('#alert-user-detail')
        .empty()
        .removeAttr('hidden')
        .removeClass('alert-success')
        .addClass('alert-danger')
        .append(message.body);
};


const getUserDetails = () => {
    $.ajax({
        type: 'GET',
        url: '/user/userdetails',
        success: response => {
            const { data: { user: { userName: name, email } } } = response;
            getUserDetailSuccessAlert();

            $('#detail-field').empty();
            const detailRow = `
            <div class="update-user-field">
                            <div class="row">
                                <div id="name-field" class="col-12 col-sm-12 col-md-3">
                                    <div class="form-group">
                                        <label for="name">User Name:</label>
                                        <input type="text" id="name" class="form-control" placeholder="User Name&mldr;" disabled>
                                    </div>
                                </div>
                                <div id="email-field" class="col-12 col-sm-12 col-md-3">
                                    <div class="form-group">
                                        <label for="email">Email:</label>
                                        <input type="text" id="email" class="form-control" placeholder="Email Address&mldr;" disabled>
                                    </div>
                                </div>
                            </div>
                            <div id="update-user-btn-field">
                                <div class="row">
                                    <div class="col-12 col-sm-12 col-md-3">
                                        <div class="form-group">
                                            <button type="submit" id="update-user-details-btn" class="btn btn-add-amount btn-block">Update</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;
            $('#detail-field').append(detailRow);
            $('input#name').val(name);
            $('input#email').val(email);
            $('#update-user-details-btn').on('click', () => {
                $('input#name, input#email').removeAttr('disabled');
                const btnRow = `
                <div class="row">
                                    <div id="save-user-details-btn-field" class="col-6 col-sm-6 col-md-3" hidden>
                                        <div class="form-group">
                                            <button type="submit" id="save-user-details-btn" class="btn btn-add-amount btn-block" disabled>Save</button>
                                        </div>
                                    </div>
                                    <div id="reset-user-details-btn-field" class="col-6 col-sm-6 col-md-3" hidden>
                                        <div class="form-group">
                                            <button type="submit" id="reset-user-details-btn" class="btn btn-add-amount btn-block" disabled>Reset</button>
                                        </div>
                                    </div>
                                    <div id="update-user-cancel-btn-field" class="col-6 col-sm-6 col-md-2">
                                        <div class="form-group">
                                            <button type="submit" id="cancel-btn" class="btn btn-add-amount btn-block">cancel</button>
                                        </div>
                                    </div>
                                </div>`;
                $('#update-user-btn-field').empty().append(btnRow);
                $('input#name, input#email').on('change', () => {
                    if ( $('input#name').val()==name && $('input#email').val()==email) {
                        $('#save-user-details-btn-field, #reset-user-details-btn-field').attr('hidden', 'true');
                        $('#save-user-details-btn, #reset-user-details-btn').attr('disabled', 'true');
                        return;
                    }
                    $('#save-user-details-btn-field, #reset-user-details-btn-field').removeAttr('hidden');
                    $('#save-user-details-btn, #reset-user-details-btn').removeAttr('disabled');
                });
                $('#save-user-details-btn').on('click', updateUserDetails );
                $('#reset-user-details-btn').on('click', () => {
                    $('input#name').attr('disabled', 'true').val(name);
                    $('input#email').attr('disabled', 'true').val(email);
                    const btnRow = `
                    <div class="row">
                                    <div class="col-12 col-sm-12 col-md-3">
                                        <div class="form-group">
                                            <button type="submit" id="update-user-details-btn" class="btn btn-add-amount btn-block">Update</button>
                                        </div>
                                    </div>
                                </div>`;
                    $('#update-user-btn-field').empty().append(btnRow);
                    getUserDetailSuccessAlert();
                });
                $('#update-user-cancel-btn-field #cancel-btn').on('click', getUserDetails);
            });
        },
        error: body => {
            const { responseJSON: { message } } = body;
            $('#detail-field').empty();
            getUserDetailErrorAlert(message);
        }
    });
}

$(document).ready(getUserDetails);