var db = require("../models"),
	express = require('express');

exports.initializeRoutes = function(app)
{
	var apiRouter = express.Router();

	// Get information about a project
	apiRouter.get('/projects.json', function (req, res) {
		db.Project.findAll().success(function(projects) {
			res.json(projects);
			return;
		});
	});

	app.use('/api', apiRouter);
}