var multiparty = require('multiparty'),
	util = require('util'),
	fs = require("fs"),
	express = require('express');

exports.initializeRoutes = function(app) 
{
	var subRouter = express.Router();

	app.use('/submit', subRouter);
}