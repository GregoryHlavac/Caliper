var express = require('express'),
    nconf = require('nconf'),
    fs = require('fs'),
	ffs = require('final-fs'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
	compressor = require('node-minify'),
	passport = require('passport');

/*  
 *  Load command-line arguments...
 *  Then from environment. 
 *  Then from caliper cfg file.
 */
nconf.argv().env();

nconf.file({ file: "caliper.cfg" });

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
});

var app = express();

app.set('renderOptions', nconf.get('renderOptions'));

app.nconf = nconf;

// Create DB after global appConfig has been set.
db = require('./models');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(require('static-favicon')("./static/favicon.ico"));
app.use(require('morgan')('dev'));
app.use(require('body-parser')())
app.use(require('method-override')());
app.use(require('compression')());
app.use(require('connect-flash')());
app.use(require('cookie-parser')());
app.use(require('express-session')({ secret: "keyboard cat"}));
app.use(passport.initialize());
app.use(passport.session());


var targetDirectory = path.resolve(__dirname, "static");
var lessDirectory = path.resolve(__dirname, "assets");

var options =
{
    "dest": targetDirectory,
    "force": false,
    "debug": false
};
var parserOptions = {};
var compilerOptions = {};

app.use(lessMiddleware(lessDirectory, options, parserOptions, compilerOptions));
app.use(express.static(path.join(__dirname, 'static'), { maxAge: nconf.get('static_content_expiration') }));

if(nconf.get('renderOptions').compress)
{

	//script(src='/ext/jquery/dist/jquery.js')
	//script(src='/ext/angular/angular.js')
	//script(src='/ext/angular-resource/angular-resource.js')
	//script(src='/ext/Chart.js/Chart.js')


	// Using UglifyJS for JS
	new compressor.minify({
		type: 'uglifyjs',
		fileIn: [
			path.join(__dirname, 'static', "ext", "jquery", "dist", "jquery.js"),
			path.join(__dirname, 'static', "ext", "angular", "angular.js"),
			path.join(__dirname, 'static', "ext", "angular-resource", "angular-resource.js"),
			path.join(__dirname, 'static', "ext", "Chart.js", "Chart.js"),
			path.join(__dirname, 'static', "bootstrap", "js", "bootstrap.js"),
			path.join(__dirname, 'static', "ext", "jasny-bootstrap", "dist", "js", "jasny-bootstrap.js"),
			path.join(__dirname, 'static', "js", "caliper_app.js"),
			path.join(__dirname, 'static', "js", "caliper_controllers.js"),
			path.join(__dirname, 'static', "js", "caliper_services.js")
		],
		fileOut: path.join(__dirname, 'static', "dist", "caliper.js"),
		callback: function(err, min){
			console.log("UglifyJS");
			console.log(err);
		}
	});

// Using Sqwish for CSS
	new compressor.minify({
		type: 'sqwish',
		fileIn: [
			path.join(__dirname, 'static', "bootstrap", "css", "bootstrap.css"),
		],
		fileOut: path.join(__dirname, 'static', "dist", "caliper.css"),
		callback: function(err, min){
			console.log('Sqwish');
			console.log(err);
		}
	});
}

var RouteDir = 'routes';

ffs.readdirRecursive(RouteDir, true, '.')
	.then(function (files) {
		files.forEach(
			function (file)
			{
				var filePath = path.resolve('./', RouteDir, file),
					nextRoute = require(filePath);
				nextRoute.initializeRoutes(app);
			});
	})
	.otherwise(function (err) {
		console.log("Route Load Error: " + err);
	});

db
    .sequelize
    .sync()
    .complete(function(err) {
        if (err) {
            throw err;
        }
        else
        {
            var server = app.listen(nconf.get("port"), function () {
                console.log('Caliper started on port %d...', server.address().port);
            });
        }
    });