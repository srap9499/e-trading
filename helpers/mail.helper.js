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

exports.sendVerifyEmail = async (user, otp) => {
    try {
        const verifyMail = {
            from: process.env.MAIL_SENDER,
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
                from: process.env.MAIL_SENDER,
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


// , (err, info) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log('Mail sent: ', info.response);
//     }
// }