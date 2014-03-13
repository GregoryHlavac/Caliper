var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello! Welcome to Root Domain.');
});

exports.app = app;