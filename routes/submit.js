var formidable = require("formidable"),
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
	    var form = new formidable.IncomingForm();

		form.uploadDir = "./minidumps";
		form.keepExtensions = true;

		form.parse(req, function(err, fields, files) {
		    if (err) {
	            console.log("Error: " + err);
		        res.send("Error");
		    }
		    else {
		        res.send("Success");
		    }
		});

	});
}