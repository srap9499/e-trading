'use strict';

const path = require('path');
// Import environment variables
require('dotenv').config();
// import express framework
const express = require('express');
const cookieParser = require('cookie-parser');

// Import routes
const authRouter = require('./routes/auth.routes');
const homeRouter = require('./routes/home.routes');
const userRouter = require('./routes/user.routes');
const cartRouter = require('./routes/cart.routes');
const productRouter = require('./routes/product.routes');

// Sequelize connection
const { sequelize } = require('./config/db-connection.config');

// import custom error middleware
const { error } = require('./middlewares/error.middleware');
// import authentication middleware
const { authenticate } = require('./middlewares/auth.middleware');

// Create express server app
const app = express();
// configure server port number
const PORT = process.env.APP_PORT

// configure view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
    res.json({ "status": 200, "success": true, "message": "Hello Welcome to E-trading development!" });
});

// Routes
app.use('/auth', authRouter);
app.use('/home', homeRouter);
app.use('/user', userRouter);
app.use('/cart', authenticate, cartRouter);
app.use('/product', productRouter);

app.use('/*', (req, res, next) => {
    return res.redirect('/home');
});

app.use(error);

sequelize.sync({ force: false, logging: false })
    .then(result => {
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err.name, err.message);
    });