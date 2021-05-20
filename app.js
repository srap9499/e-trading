'use strict';

const path = require('path');
// Import environment variables
require('dotenv').config();
// import express framework
const express = require('express');
const cookieParser = require('cookie-parser');

// Import routes
const authRouter = require('./routes/auth.routes');

// Sequelize connection
const { sequelize } = require('./config/db-connection.config');

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

sequelize.sync({ force: false, logging: false })
    .then(result => {
        app.listen(PORT, () => {
            console.log(`Server started on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err.name, err.message);
    });