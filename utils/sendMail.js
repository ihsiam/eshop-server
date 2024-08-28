// dependencies
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async ({ email, sub, text }) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: sub, // Subject line
        text, // plain text body
    });
};

module.exports = sendMail;
