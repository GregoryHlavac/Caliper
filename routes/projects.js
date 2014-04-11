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
			.find({ where: { version: id, ProjectId: req.project.id } })
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
	 *  the 6 most recent releases
	 */
	projRouter.get('/:project', function (req, res) {
		var proj = req.project;

		db.Release.getLimited(req.project.id, 6, function(releases) {
			res.render('project/project', {
				page_title: "Caliper :: " + proj.title,
				project: proj,
				releases: releases
			});
		}, function(err) {
			res.status(404).render('error', {
				page_title: "Caliper :: Error",
				error: "Could not load releases for project " + proj.title
			});
		});
	});

	// TODO: Project Release Archive
	projRouter.get('/:project/archive', function (req, res) {
		console.log("Offset: " + req.param("offset"));

		var proj = req.project;

		db.Release.getLimitedOffsetBy(proj.id, 10, 3, function(releases) {
			res.render('project/release/archive', {
				page_title: "Caliper :: " + proj.title + " :: Archive",
				project: proj,
				releases: releases,
				startIndex: 0
			});
		}, function(err) {
			res.status(404).render('error', {
				page_title: "Caliper :: Error",
				error: "Could not load release archive for project " + proj.title
			});
		});
	});

	// Error page for missing project.
	projRouter.use(function(err, req, res, next) {
		if(err)
		{
			res.status(404).render('error', {
				page_title: "Caliper :: Project Not Found",
				error: "Could not find project under the requested title. Check your URL and make sure a project with that name actually exists."
			});
		}
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
		{
			res.status(404).render('error', {
				page_title: "Caliper :: Release Not Found",
				error: "Could not find release under project " + req.project.title + " make sure the version you're looking for exists under the project."
			});
		}
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
		{
			res.status(404).render('error', {
				page_title: "Caliper :: Crash Report Not Found",
				error: "Could not find crash report under project " + req.project.title + " version " + req.release.version + ", you probably followed a bad link."
			});
		}
		else next();
	});

	// Catch-All Error Handler, just in-case another one of the error handlers throws an error.
	projRouter.use(function(err, req, res, next) {
		if(err)
		{
			res.status(404).render('error', {
				page_title: "Caliper :: Unknown Error",
				error: "An unknown error occurred, I am not sure how you pulled this one off."
			});
		}
		else next();
	});

	app.use('/projects', projRouter);
}