var db = require("../models"),
	express = require('express'),
	lodash = require('lodash');

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
	/*
	 *  Get information about a specific project, this also pulls
	 *  the 10 most recent releases
	 */
	projRouter.get('/:project', function (req, res) {
		var proj = req.project;

		db.Release
			.findAll({
				where: { ProjectId: req.project.id },
				limit: 3,
				order: '`version` DESC'
			}).success(function(rlses) {
				res.render('project/project', {
					page_title: "Caliper :: " + proj.title,
					project: proj,
					releases: rlses
				});
			}).error(function(err) {

			});
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


		var total = rls.unidentified_crashes + rls.identified_crashes + rls.fixed_crashes;

		res.render('project/release', {
			page_title: "Caliper :: " + proj.title + " " + rls.version,
			project: proj,
			release: rls,
			crashes: (rls.unidentified_crashes / total) * 100.0,
			identified: (rls.identified_crashes / total) * 100.0,
			fixed: (rls.fixed_crashes / total) * 100.0
		});
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

		res.render('project/crash', {
			page_title: "Caliper :: " + proj.title + " " + rls.version + " Crash Report",
			project: proj,
			release: rls,
			crash: crs
		});
	});

	// Error page for missing crash.
	projRouter.use(function(err, req, res, next) {
		if(err)
			res.send(404, "Error retrieving crash.");
		else next();
	});

	app.use('/projects', projRouter);
}