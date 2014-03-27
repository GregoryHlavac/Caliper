var db = require("../models"),
	express = require('express');

exports.initializeRoutes = function(app) 
{
	var csRouter = express.Router();

    csRouter.get('/', function (req, res) {
        db.Release.findAll({
            include: [db.Crash]
        }).success(function(rls) {
            res.render("crash-stats/index",
            {
                project_name: app.nconf.get("project_name"),
                releases: rls
            });
        });
    });



	app.use('/crash-stats', csRouter);
}