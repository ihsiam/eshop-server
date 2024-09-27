/* eslint-disable no-underscore-dangle */
// dependencies
const { Schema, model } = require('mongoose');

// schema
const shopSchema = new Schema({
    shopName: {
        type: String,
        required: [true, 'Please enter your shop name!'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email!'],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minLength: [4, 'Password should be greater than 4 characters'],
    },
    phoneNumber: {
        type: Number,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'seller',
    },
    avatar: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordTime: Date,
});

// model
const Shop = model('Shop', shopSchema);

module.exports = Shop;
