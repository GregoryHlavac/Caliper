var db = require("../models"),
	express = require('express'),
	cp = require('child_process'),
	path = require('path'),
	os = require('os'),
	mdsw =  require('minidump-stackwalker'),
	fs = require('fs');

exports.initializeRoutes = function(app)
{
	var mdRouter = express.Router();

	mdRouter.get('/:minidump_target', function (req, res) {
		mdsw.readMinidump("./minidumps/" + req.params.minidump_target + ".dmp","./symbols",
			function(err, stdout, stderr) {
				if(err)
				{
					console.log(err);
					res.send(404, "");
				}
				else
				{
					res.json(200, JSON.parse(stdout));
				}
			});
	});

	app.use('/minidump', mdRouter);
}