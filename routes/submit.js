var formidable = require("formidable"),
    multiparty = require('multiparty'),
	util = require('util'),
	fs = require("fs");

exports.initializeRoutes = function(app) 
{  
	app.get('/submit', function (req, res) {
		res.render("submit/submit",
		{
			project_name: app.nconf.get("project_name"),
			page_title: "Caliper :: Manual Crash Reporter"
		});
	});

	app.post('/submit', function(req, res) {
		var cdOpts = {
			maxFilesSize: app.nconf.get("submit_file_byte_limit"), // This is 2 MB
			autoFields: true,
			autoFiles: true,
			uploadDir: "./minidumps"
		};

		var form = new multiparty.Form(cdOpts);

		form.on('error', function(err) {
			console.log(err);
			res.header('Connection', 'close');
			res.send(413, "Error");
		});

		form.on('file', function(name, file) {
			console.log("File Received as Field: " + name);
			console.log(file);
		});

		form.on('close', function() {
			res.send(200, "Success");
		});

		form.parse(req);
	});
}