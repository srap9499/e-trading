'use strict';

require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

exports.sendVerifyEmail = (user, otp) => {
    const verifyMail = {
        from: process.env.MAIL_SENDER,
        to: user.email,
        subject: "Please verify email to Activate your account!",
        html: `<h1>Welcome ${user.userName}</h1>
        <p>We are glad to see you registering on E-Trading. Plaese activate your account by verifying your email address</p>
        <br><br>
        <p>Your OTP for verification: ${otp}</p>`
    };

    transporter.sendMail(verifyMail, (err, info) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Mail sent: ', info.response);
        }
    });
};