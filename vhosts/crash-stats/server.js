var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello! Welcome to Crash-Stats Domain.');
});

exports.app = app;