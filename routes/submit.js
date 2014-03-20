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
	            console.log("ERROR: " + err);
                res.render("index",  { project_name: app.nconf.get("project_name") });
		    }
		    else {
		        res.writeHead(200, { 'content-type': 'text/plain' });
		        res.write('received upload:\n\n');
		        res.end(util.inspect({ fields: fields, files: files }));

		        console.log(util.inspect({ fields: fields, files: files }));
		    }
		});

	});
}