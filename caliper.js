var express = require('express'),
    nconf = require('nconf'),
    fs = require('fs'),
    path = require('path'),
    lessMiddleware = require('less-middleware'),
    db = require('./models');


var oneDay = 86400000;

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
    "project_name": "Caliper"
});

var app = express();

app.nconf = nconf;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon("./static/favicon.ico"));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

app.use(express.compress());

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
app.use(express.static(path.join(__dirname, 'static')));

var RouteDir = 'routes',
    files = fs.readdirSync(RouteDir);

files.forEach(
function (file)
{
    var filePath = path.resolve('./', RouteDir, file),
        route = require(filePath);
    route.initializeRoutes(app);
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

