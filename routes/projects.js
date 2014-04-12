var db = require("../models"),
	express = require('express'),
	lodash = require('lodash'),
	multiparty = require('multiparty'),
	fs = require('fs'),
	Project = db.Project;
	Release = db.Release,
	Crash = db.Crash,
	Report = db.Report,
	StackFrame = db.StackFrame,
	mdsw =  require('minidump-stackwalker');

exports.initializeRoutes = function(app)
{
	var projRouter = express.Router();

	projRouter.param('project', function(req, res, next, id) {
		Project
			.find({ where: { title: id }, include: [Release] })
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
		Release
			.find({ where: { version: id, ProjectId: req.project.id }, include: [Crash] })
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
		Crash
			.find({ where: { id: id, ReleaseId: req.release.id }, include: [Report]})
			.complete(function(err, crs) {
				if(err)
					return next(err);
				else if(!crs)
					return next(new Error("Crash failed to load."));

				req.crash = crs;
				next();
			});
	});

	projRouter.param('report', function(req, res, next, id) {
		Report
			.find({ where: { CrashId: req.crash.id, report_uuid: id }, include: [StackFrame]})
			.complete(function(err, rp) {
				if(err)
					return next(err);
				else if(!rp)
					return next(new Error("Report failed to load."));

				req.report = rp;
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

	projRouter.get('/:project/submit', function (req, res) {
		res.render("submit/submit",
			{
				project_name: app.nconf.get("project_name"),
				page_title: "Caliper :: Manual Crash Reporter"
			});
	});

	projRouter.post('/:project/submit', function(req, res) {
		var cdOpts = {
			maxFilesSize: app.nconf.get("submit_file_byte_limit"), // This is 2 MB
			autoFields: true,
			autoFiles: true,
			uploadDir: "./minidumps"
		};

		var form = new multiparty.Form(cdOpts);

		form.parse(req, function(err, fields, files) {
			if(err) {
				console.log(err);
				res.header('Connection', 'close');
				res.send(413, "Error");
				return;
			}
			res.send(200, "Success");


			var cdf = files.crashdump[0];

			mdsw.readMinidump(cdf.path,"./symbols", function(err, stdout, stderr) {
				if(err)
				{
					console.log("Error Parsing Minidump: " + err);
				}
				else
				{
					var parsed = JSON.parse(stdout);

					Release.assureVersion(req.project, fields.version, function(rls) {
						console.log("Release: %s found/created.", rls.version);

						Crash.assureSignature(rls, parsed.crashing_thread.frames[0].function, function(crs) {
							console.log("Crash: %s found/created.", crs.signature);

							Report.assureReport(db, crs, cdf.originalFilename.replace(".dmp", ""), fields.user, fields.description, parsed, function(rpt) {
								console.log("Report %s Created", rpt.report_uuid);
							}, function(err) {
								console.log("Report couldn't be created.");
							});

						}, function(err) {
							console.log("Crash couldn't be created.");
						});

					}, function(err) {
						console.log("Release couldn't be created.");
					});
				}
			});

			console.log(fields);
			console.log(files);
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
		var crashes = rls.crashes;

		console.log(rls);

		var total = rls.unidentified_crashes + rls.identified_crashes + rls.fixed_crashes;

		res.render('project/release/release', {
			page_title: "Caliper :: " + proj.title + " " + rls.version,
			project: proj,
			release: rls,
			reported_crashes: crashes,
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
		var reports = crs.reports;

		res.render('project/crash', {
			page_title: "Caliper :: " + proj.title + " " + rls.version + " Crash",
			project: proj,
			release: rls,
			crash: crs,
			reports: reports
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

	projRouter.get('/:project/:release/:crash/:report', function(req, res) {
		console.log(req.report);

		res.render('project/report', {
			page_title: "Caliper :: " + req.project.title + " " + req.release.version + " Crash Report",
			project: req.project,
			release: req.release,
			crash: req.crash,
			report: req.report,
			frames: req.report.stackFrames
		});
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