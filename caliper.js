var nconf = require('nconf');
var express = require('express');

var root = require('./vhosts/root/server').app;
var contentStatic = require("./vhosts/static/static_server").app;
var crashStat = require('./vhosts/crash-stats/server').app;
var submit = require('./vhosts/submit/server').app;

/*  
 *  Load command-line arguments...
 *  Then from environment. 
 *  Then from caliper cfg file.
 */
nconf.argv().env();

nconf.file({ file: "caliper.cfg" });

nconf.defaults(
{

    "port": "8080"
});

var app = express();

// A gear will have to do, couldn't find a good one of a caliper.
app.use(express.favicon("./static/favicon.ico"));

app
    .use(express.vhost('localhost', root))
    .use(express.vhost('static.localhost', contentStatic))
    .use(express.vhost('crash-stats.localhost', crashStat))
    .use(express.vhost('submit.localhost', submit));

var server = app.listen(nconf.get("port"), function() 
{
    console.log('Caliper started on port %d...', server.address().port);
});