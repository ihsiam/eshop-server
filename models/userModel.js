/* eslint-disable no-underscore-dangle */
// dependencies
const { Schema, model } = require('mongoose');

// schema
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name!'],
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
    },
    addresses: [
        {
            country: {
                type: String,
            },
            city: {
                type: String,
            },
            address1: {
                type: String,
            },
            address2: {
                type: String,
            },
            zipCode: {
                type: Number,
            },
            addressType: {
                type: String,
            },
        },
    ],
    role: {
        type: String,
        default: 'user',
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
const User = model('User', userSchema);

module.exports = User;
