var multiparty = require('multiparty'),
	util = require('util'),
	fs = require("fs"),
	express = require('express');

exports.initializeRoutes = function(app) 
{
	var subRouter = express.Router();


	subRouter.get('/', function (req, res) {
		res.render("submit/submit",
		{
			project_name: app.nconf.get("project_name"),
			page_title: "Caliper :: Manual Crash Reporter"
		});
	});

	subRouter.post('/', function(req, res) {
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

			console.log(fields);
			console.log(files);

			res.send(200, "Success");
		});
	});

	app.use('/submit', subRouter);
}