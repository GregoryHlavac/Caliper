var db = require("../models"),
	express = require('express'),
	lodash = require('lodash'),
	multiparty = require('multiparty'),
	fs = require('fs'),
	Project = db.Project,
	Release = db.Release,
	mdsw = require('minidump-stackwalker');

exports.initializeRoutes = function(app)
{
	var projRouter = express.Router();

	projRouter.param('project', function(req, res, next, id) {
		Project
			.find({ where: { title: id }})
			.complete(function(err, proj) {
				if(err)
					return next(err);
				else if(!proj)
					return next(new Error("Project failed to load."));

				req.project = proj;
				next();
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

			console.log(JSON.stringify(cdf));

			mdsw.readMinidump(cdf.path,"./symbols", function(err, stdout, stderr) {
				require('../etc/minidump').dumpCallback(cdf, req, fields, err, stdout, stderr);
			});
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