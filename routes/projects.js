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

		db.Release.getLimited(req.project.id, 3, function(releases) {
			res.render('project/project', {
				page_title: "Caliper :: " + proj.title,
				project: proj,
				releases: releases,
				startIndex: 0
			});
		}, function(err) {
			// TODO: Error Rendering
		});
	});

	// TODO: Project Release Archive
	projRouter.get('/:project/archive', function (req, res) {
		console.log("Offset: " + req.params['offset']);

		db.Release.getLimitedOffsetBy(req.project.id, 10, 3, function(releases) {
			res.send(200, "LOL");
		}, function(err) {
			// TODO: Error Rendering
		});
	});

		// Error page for missing project.
	projRouter.use(function(err, req, res, next) {
		if(err)
			; // TODO: Error Rendering
		else next();
	});

	// Get information about a specific release of a project.
	projRouter.get('/:project/:release', function (req, res) {
		var proj = req.project;
		var rls = req.release;

		var total = rls.unidentified_crashes + rls.identified_crashes + rls.fixed_crashes;

		res.render('project/release/release', {
			page_title: "Caliper :: " + proj.title + " " + rls.version,
			project: proj,
			release: rls,
			crashes: (rls.unidentified_crashes / total) * 100.0,
			identified: (rls.identified_crashes / total) * 100.0,
			fixed: (rls.fixed_crashes / total) * 100.0
		});
	});


	// TODO: Fixed/Identified/Crashes sub-paths releases.
	projRouter.get('/:project/:release/fixed', function(req, res) {

	});

	projRouter.get('/:project/:release/identified', function(req, res) {

	});

	projRouter.get('/:project/:release/crashes', function(req, res) {

	});

	// Error page for missing release.
	projRouter.use(function(err, req, res, next) {
		if(err)
			; // TODO: Error Rendering
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
			; // TODO: Error Rendering
		else next();
	});

	app.use('/projects', projRouter);
}