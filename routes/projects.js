var db = require("../models"),
	express = require('express');

exports.initializeRoutes = function(app)
{
	var projRouter = express.Router();

	projRouter.param('project', function(req, res, next, id) {
		db.Project
			.find({ where: { title: id }, include: [db.Release] })
			.complete(function(err, proj) {
				if(err)
					return next(err);
				else if(!proj)
					return next(new Error("Project failed to load."));

				req.project = proj;
				next();
			});
	});

	projRouter.param('release', function(req, res, next, id) {
		db.Release
			.find({ where: { version: id, ProjectId: req.project.id }, include: [db.Crash] })
			.complete(function(err, rls) {
				if(err)
					return next(err);
				else if(!rls)
					return next(new Error("Release failed to load."));

				req.release = rls;
				next();
			});
	});

	projRouter.param('crash', function(req, res, next, id) {
		db.Crash
			.find({ where: { crash_id: id, ReleaseId: req.release.id }})
			.complete(function(err, crs) {
				if(err)
					return next(err);
				else if(!crs)
					return next(new Error("Crash failed to load."));

				req.crash = crs;
				next();
			});
	});

	// Get information about a project
	projRouter.get('/:project', function (req, res) {
		var proj = req.project;

		res.render('project/project', { project: proj });
	});

	// Error page for missing project.
	projRouter.use(function(err, req, res, next) {
		if(err)
			res.send(404, "Error retrieving project.");
		else next();
	});

	// Get information about a specific release of a project.
	projRouter.get('/:project/:release', function (req, res) {
		var proj = req.project;
		var rls = req.release;

		res.render('project/release', { project: proj, release: rls });
	});

	// Error page for missing release.
	projRouter.use(function(err, req, res, next) {
		if(err)
			res.send(404, "Error retrieving release.");
		else next();
	});

	// Get information about a specific crash on a release.
	projRouter.get('/:project/:release/:crash', function(req, res) {
		var proj = req.project;
		var rls = req.release;
		var crs = req.crash;

		res.render('project/crash', { project: proj, release: rls, crash: crs });
	});

	// Error page for missing crash.
	projRouter.use(function(err, req, res, next) {
		if(err)
			res.send(404, "Error retrieving crash.");
		else next();
	});

	app.use('/projects', projRouter);
}