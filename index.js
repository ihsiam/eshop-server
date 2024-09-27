// dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ConnectDb = require('./config/db');
const UserRouter = require('./controller/userController');
const ShopRouter = require('./controller/shopController');
require('dotenv').config();

// app define
const app = express();

// middlewares
app.use(express.json());
app.use(
    cors({
        origin: process.env.ORIGIN,
        credentials: true,
        // eslint-disable-next-line prettier/prettier
    }),
);
app.use(cookieParser());
app.use('/', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));

// port define
const PORT = process.env.PORT || 3000;

// db connection
ConnectDb();

// routes
app.use('/api/v2/user', UserRouter);
app.use('/api/v2/shop', ShopRouter);

// 404 error handle
app.use((req, res, next) => {
    res.send('Page not found');
    next();
});

// server error handle
app.use((req, res, err, next) => {
    res.send(`Err: ${err}`);
    console.log(err);
    next();
});

// run server
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
});
