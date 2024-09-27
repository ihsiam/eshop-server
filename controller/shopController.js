// dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../utils/multer');
const Shop = require('../models/shopModel');
const { activationToken, loginToken } = require('../utils/token');
const SendMail = require('../utils/sendMail');
// const isAuth = require('../middleware/auth');
require('dotenv').config();

const saltRounds = 10;

// router define
const ShopRouter = express.Router();

// sign up req handle
ShopRouter.post('/create-shop', upload.single('file'), async (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { shopName, email, password, zipCode, phoneNumber, address } = req.body;
    const { filename } = req.file;
    const fileUrl = path.join(filename);
    const hashPass = await bcrypt.hash(password, saltRounds);
    try {
        // check email
        const shopData = await Shop.findOne({ email });

        // delete uploaded img if user exists
        if (shopData) {
            const filePath = `uploads/${filename}`;
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(err);
                }
            });
            return res.status(400).json({ msg: 'Shop already exists!' });
        }

        // shop obj
        const shop = {
            shopName,
            email,
            password: hashPass,
            avatar: fileUrl,
            phoneNumber,
            zipCode,
            address,
        };

        // activation token generate
        const token = activationToken(shop);
        const activationUrl = `http://localhost:5173/shop/activation/${token}`;

        // send activation token
        await SendMail({
            email,
            sub: 'Activate your shop account',
            text: `Hello, ${shop.shopName}. Click here to activate your account: ${activationUrl}`,
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
ShopRouter.post('/activate', async (req, res) => {
    try {
        const { token } = req.body;
        // token validity
        let shopInfo;
        try {
            shopInfo = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError') {
                return res
                    .status(400)
                    .json({ msg: 'Token expired, please request a new activation link.' });
            }
        }

        // check email
        const { email } = shopInfo;
        const shopData = await Shop.findOne({ email });

        // if email exists
        if (shopData) {
            return res.status(400).json({ msg: 'Shop already exists!' });
        }

        // create shop
        const shop = new Shop(shopInfo);
        const newShop = await shop.save();
        // set token
        return loginToken(newShop, 201, res);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Server side error.' });
    }
});

module.exports = ShopRouter;
