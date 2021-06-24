'use strict';

const {
    development: {
        mailer : {
            MAIL_SERVICE,
            MAIL_USER,
            MAIL_PASSWORD,
            MAIL_SENDER
        }
    }
} = require('../config/development.config');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: MAIL_SERVICE,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

exports.sendVerifyEmail = async (user, otp) => {
    try {
        const verifyMail = {
            from: MAIL_SENDER,
            to: user.email,
            subject: "Please verify email to Activate your account!",
            html: `<h1>Welcome ${user.userName}</h1>
            <p>We are glad to see you registering on E-Trading. Please activate your account by verifying your email address</p>
            <br><br>
            <p>Your OTP for verification: <a href="" style="color: blue;">${otp}</a></p>`
        };
    
        const info = await transporter.sendMail(verifyMail);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.log("Email not sent:", error.message);
        throw error;
    }
};

exports.sendUpdateDetailVerifyEmail = async (user, otp, validity) => {
    try {
        const verifyMail = {
            from: MAIL_SENDER,
            to: user.email,
            subject: "Please verify email to Update your Profile details!",
            html: `<h1>Welcome ${user.userName}</h1>
            <p>We are glad to see you as a valueable customer on E-Trading. Verify your email using OTP provided below to change profile details</p>
            <br><br>
            <p>Your OTP for verification: <a href="" style="color: blue;">${otp}</a></p>
            <p>Valid for: ${validity}</p>`
        };
    
        const info = await transporter.sendMail(verifyMail);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.log("Email not sent:", error.message);
        throw error;
    }
};

exports.sendSignUpNotificationMail = (user, amount) => {
    const signUpNotificationList = [
        {
            "subject": "E-Trading: Notification!",
            "html": `<h1>Hello ${user.userName}</h1>
            <p>We are glad to see you registering on E-Trading. Activate your account and get bonus amount of <a href="" style="color: blue;">${amount}</a> in your wallet</p>`
        },
        {
            "subject": "E-Trading: Notification!",
            "html": `<h1>Hello ${user.userName}</h1><br><p>We are glad to see you registering on E-Trading. Activate your account and get discount coupon: <a href="" style="color: blue;">Buy One Get One Free</a></p>`
        },
        {
            "subject": "E-Trading: Notification!",
            "html": `<h1>Hello ${user.userName}</h1><br><p>We are glad to see you registering on E-Trading. Activate your account and get benefits of Products Purchase!</p>`
        }
    ];
    try {
        signUpNotificationList.forEach(async n => {
            const notifyMail = {
                from: MAIL_SENDER,
                to: user.email,
                subject: n.subject,
                html: n.html
            };
            const info = await transporter.sendMail(notifyMail);
            console.log("Email sent:", info.response);
        });
    } catch (error) {
        console.log("Email not sent:", error.message);
        throw error;
    }
};


exports.sendInvoiceMail = (user, orderId) => {
    const invoiceName = `Invoice_${user.id}_${orderId}.pdf`;
    const invoicePath = path.join(__dirname, `../public/Invoices/Invoice_${user.id}_${orderId}.pdf`);
    const invoiceMail = {
        from: MAIL_SENDER,
        to: user.email,
        subject: "Purchase Invoice",
        attachments: [
            {
                filename: invoiceName,
                path: invoicePath,
            }
        ],
        "html": `<h1>Hello ${user.userName}</h1>
        <p>We are glad to have you as valueable customer of E-Trading. Your recent order is placed successfully, Please find your Retail Invoice here with...<br><br>Thank you,
        <br>- team E-Trading</p>`
    };
    transporter.sendMail(invoiceMail, (error, info) => {
        if (error) {
            console.log("Email not sent:", error.message);
            throw error;
        } else {
            console.log("Email sent:", info.response);
        }
    });
};