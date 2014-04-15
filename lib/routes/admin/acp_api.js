var db = require("../../models"),
	express = require('express');

exports.initializeRoutes = function(app)
{
	var apiRouter = express.Router();

	app.use('/admin/api', apiRouter);
}