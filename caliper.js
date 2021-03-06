"use strict";

var express = require('express'),
    nconf = require('nconf'),
    fs = require('fs'),
	ffs = require('final-fs'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
	compressor = require('node-minify'),
	passport = require('passport'),
	Sleep = require('sequelize-sleep');

// For my dev..
//var Sleep = require('../node-sequelize-sleep');


/*  
 *  Load command-line arguments...
 *  Then from environment. 
 *  Then from caliper cfg file.
 */
nconf.argv().env();

nconf.file({ file: nconf.get("cfg") || "caliper.cfg" });

nconf.defaults(
	{
		"port": "8080",
		"static_content_expiration": 30*24*60*60*1000,
		"submit_file_byte_limit": 2097152,
		"bcrypt_salt_size": 10,

		"renderOptions": {
			"compress": false,
			"useCDN": true
		}
	}
);


var app = express();

app.set('renderOptions', nconf.get('renderOptions'));

app.nconf = nconf;

// Create DB after global appConfig has been set.
var db = require(path.resolve(__dirname, 'lib', 'models'));

app.set('views', path.resolve(__dirname, 'lib', 'views'));
app.set('view engine', 'jade');
app.use(require('static-favicon')("./lib/static/favicon.ico"));
app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('compression')());
app.use(require('connect-flash')());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: "keyboard cat"}));
app.use(passport.initialize());
app.use(passport.session());


var targetDirectory = path.resolve(__dirname, 'lib', 'static');
var lessDirectory = path.resolve(__dirname, 'lib', 'assets');

var options =
{
    "dest": targetDirectory,
    "force": false,
    "debug": false
};
var parserOptions = {};
var compilerOptions = {};

app.use(lessMiddleware(lessDirectory, options, parserOptions, compilerOptions));
app.use(express.static(path.join(__dirname, 'lib', 'static'), { maxAge: nconf.get('static_content_expiration') }));

var RouteDir = path.resolve(__dirname, 'lib', 'routes');

ffs.readdirRecursive(RouteDir, true, '.')
	.then(function (files) {
		files.forEach(function (file)
			{
				var filePath = path.resolve(RouteDir, file),
				nextRoute = require(filePath);
				nextRoute.initializeRoutes(app);
			}
		);
	})
	.otherwise(function (err) {
		console.log("Route Load Error: " + err);
	});

db.sequelize.sync().complete(function(err) {
	if (err) {
		throw err;
	}

	var server = app.listen(nconf.get("port"), function () {
		console.log('Caliper started on port %d...', server.address().port);
	});
});