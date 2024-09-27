// dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../utils/multer');
const User = require('../models/userModel');
const { activationToken, loginToken } = require('../utils/token');
const SendMail = require('../utils/sendMail');
const isAuth = require('../middleware/auth');
require('dotenv').config();

const saltRounds = 10;

// router define
const UserRouter = express.Router();

// sign up req handle
UserRouter.post('/create-user', upload.single('file'), async (req, res) => {
    const { name, email, password } = req.body;
    const { filename } = req.file;
    const fileUrl = path.join(filename);
    const hashPass = await bcrypt.hash(password, saltRounds);
    try {
        // check email
        const userData = await User.findOne({ email });

        // delete uploaded img if user exists
        if (userData) {
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.status(400).json({ msg: 'User already exists!' });
        }

        // user obj
        const user = {
            name,
            email,
            password: hashPass,
            avatar: fileUrl,
        };

        // activation token generate
        const token = activationToken(user);
        const activationUrl = `http://localhost:5173/user/activation/${token}`;

        // send activation token
        await SendMail({
            email,
            sub: 'Activate your account',
            text: `Hello, ${user.name}. Click here to activate your account: ${activationUrl}`,
        });

        return res.status(200).json({
            success: true,
            msg: 'Please check your email to activate the account.',
        });
    } catch (err) {
        return res.status(500).json({ msg: 'Server side error.' });
    }
});

// eslint-disable-next-line consistent-return
// activate user
UserRouter.post('/activate', async (req, res) => {
    try {
        const { token } = req.body;
        // token validity
        let userInfo;
        try {
            userInfo = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError') {
                return res
                    .status(400)
                    .json({ msg: 'Token expired, please request a new activation link.' });
            }
        }

        // check email
        const { email } = userInfo;
        const userData = await User.findOne({ email });

        // if email exists
        if (userData) {
            return res.status(400).json({ msg: 'User already exists!' });
        }

        // create user
        const user = new User(userInfo);
        const newUser = await user.save();
        // set token
        return loginToken(newUser, 201, res);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Server side error.' });
    }
});

// login
UserRouter.post('/login', async (req, res) => {
    // collect data
    const { email, password } = req.body;
    try {
        if (email && password) {
            // find user
            const userData = await User.findOne({ email });
            if (userData) {
                // compare pass
                const comparePass = await bcrypt.compare(password, userData.password);
                if (comparePass) {
                    // set token
                    return loginToken(userData, 201, res);
                }
                return res.status(200).json({ msg: 'Invalid email or password!' });
            }
            return res.status(400).json({ msg: 'Invalid email or password!' });
        }
        return res.status(400).json({ msg: 'Fill all the field!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Server side error!' });
    }
});

// get user data
UserRouter.get('/userInfo', isAuth, async (req, res) => {
    try {
        if (req.user) {
            return res.status(200).json(req.user);
        }
        return res.status(400).json({ msg: 'user not found' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});

// logout
UserRouter.get('/logOut', isAuth, async (req, res) => {
    try {
        return res
            .cookie('token', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })
            .status(200)
            .json({ msg: 'Logged out' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
});
module.exports = UserRouter;
