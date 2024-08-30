// dependencies
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const userInfo = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = userInfo;
        // Fetch user from database
        req.user = await User.findOne({ email });
        if (!req.user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        // Continue to next middleware or route handler
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired, please login again' });
        }
        // Handle other errors
        return res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = isAuth;
