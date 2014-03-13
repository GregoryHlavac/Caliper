var express = require('express'),
    path = require('path'),
    lessMiddleware = require('less-middleware');
var app = express();

var oneDay = 86400000;

app.use(express.compress());

var targetDirectory = path.resolve(__dirname, "..", "..", "static");
var lessDirectory = path.resolve(__dirname, "..", "..", "assets");

var options =
{
    "dest": targetDirectory,
    "force": true,
    "debug": true
};
var parserOptions = {};
var compilerOptions = {};

app.use(lessMiddleware(lessDirectory, options, parserOptions, compilerOptions));
app.use(express.static(targetDirectory, { maxAge: oneDay }));

exports.app = app;