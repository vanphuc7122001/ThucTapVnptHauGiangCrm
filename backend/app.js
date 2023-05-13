// npm packages
const createError = require('http-errors');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// initialize
const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// simple route
app.get('/', (res) => {
    return res.send({
        message: 'Welcom to Personal CRM System'
    })
});

// check errors
app.use((req, res, next) => {
    return next(
        createError(404, 'Resource Not Found')
    );
});

app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error"
    });
});


// exports
module.exports = app;

