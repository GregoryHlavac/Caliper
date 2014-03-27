var express = require('express'),
    nconf = require('nconf'),
    fs = require('fs'),
    path = require('path'),
    lessMiddleware = require('less-middleware');

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
	"static_content_expiration": 86400000,
    "project_name": "Caliper",
    "submit_file_byte_limit": 2097152
});

var app = express();

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

