// dependencies
const jwt = require('jsonwebtoken');
require('dotenv').config();

// activation token
exports.activationToken = (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '5m' });
};

// login token
exports.loginToken = (user, statusCode, res) => {
    const { email } = user;
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
    const options = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};
