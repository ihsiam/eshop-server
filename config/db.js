// dependencies
const mongoose = require('mongoose');
require('dotenv').config();

// connect to db
const ConnectDb = () => {
    mongoose
        .connect(process.env.DB_URI)
        .then(() => console.log('DB connected succesfully'))
        .catch((err) => console.log(err));
};

module.exports = ConnectDb;
