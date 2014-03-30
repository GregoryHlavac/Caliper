var express = require('express'),
    nconf = require('nconf'),
    fs = require('fs'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
	compressor = require('node-minify');

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
	// Using UglifyJS for JS
	new compressor.minify({
		type: 'uglifyjs',
		fileIn: [
			path.join(__dirname, 'static', "jquery", "jquery-2.1.0.js"),
			path.join(__dirname, 'static', "angular-1.3.0-beta.3", "angular.js"),
			path.join(__dirname, 'static', "angular-1.3.0-beta.3", "angular-resource.js"),
			path.join(__dirname, 'static', "bootstrap", "js", "bootstrap.js"),
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


var RouteDir = 'routes',
    files = fs.readdirSync(RouteDir);

files.forEach(
function (file)
{
    var filePath = path.resolve('./', RouteDir, file),
        nextRoute = require(filePath);
    nextRoute.initializeRoutes(app);
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

