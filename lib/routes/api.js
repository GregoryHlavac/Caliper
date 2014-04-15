var db = require("../models"),
	express = require('express');

exports.initializeRoutes = function(app)
{
	var apiRouter = express.Router();

	apiRouter.param('project', function(req, res, next, id) {
		db.Project
			.find({ where: { title: id }})
			.complete(function(err, proj) {
				if(err)
					next(err);
				else if(!proj)
					next(new Error("Project failed to load."));

				req.project = proj;
				next();
			});
	});

	apiRouter.param('release', function(req, res, next, id) {
		db.Release
			.find({ where: { version: id, ProjectId: req.project.id }})
			.complete(function(err, rls) {
				if(err)
					next(err);
				else if(!rls)
					next(new Error("Release failed to load."));

				req.release = rls;
				next();
			});
	});

	apiRouter.param('crash', function(req, res, next, id) {
		db.Crash
			.find({ where: { crash_id: id, ReleaseId: req.release.id }})
			.complete(function(err, crs) {
				if(err)
					next(err);
				else if(!crs)
					next(new Error("Crash failed to load."));

				req.crash = crs;
				next();
			});
	});



	// Get information about projects.
	apiRouter.get('/projects.json', function (req, res) {
		db.Project.findAll().success(function(projects) {
			res.json(projects);
		});
	});

	apiRouter.get('/:project/releases.json', function(req, res) {
		res.json(req.project.releases);
	});

	apiRouter.get('/:project/:release/:crash/about.json', function(req, res) {
		res.json(req.crash);
	});

	app.use('/api', apiRouter);
}