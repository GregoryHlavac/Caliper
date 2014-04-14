var fs = require('fs'),
	path = require('path'),
	lodash = require('lodash'),
	Sequelize = require('sequelize'),
    nconf = require('nconf'),
	db = {};

var sequelize;

if (nconf.get("database:url") == null && nconf.get("database:db") == null) {
	sequelize = new Sequelize('caliper', 'root', 'root');
	console.log("[Database] Initialized with default settings.");
}
else if (nconf.get("database:url") != null) {
    if(nconf.get("database:options") == null)
	    sequelize = new Sequelize(nconf.get("database:url"));
    else
        sequelize = new Sequelize(nconf.get("database:url"), nconf.get("database:options"));

	console.log("[Database] Initialized from URL.");
}
else if (nconf.get("database:db") != null) {
	if(nconf.get("database:options") == null)
		sequelize = new Sequelize(nconf.get("database:db"), nconf.get("database:username"), nconf.get("database:password"));
	else
		sequelize = new Sequelize(nconf.get("database:db"), nconf.get("database:username"), nconf.get("database:password"), nconf.get("database:options"));

    console.log("[Database] Initialized from explicit parameters.");
}

if (sequelize == null)
	throw "[Database] Something went wrong when initializing SequelizeJS";


fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf('.') !== 0) && (file !== 'index.js');
	})
	.forEach(function(file) {
		var model = sequelize.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function(modelName) {
	if ('associate' in db[modelName]) {
		db[modelName].associate(db);
	}
});

module.exports = lodash.extend({
	sequelize: sequelize,
	Sequelize: Sequelize
}, db);
