var db = require("../models");

exports.initializeRoutes = function(app) 
{
    var ind = "/crash-stats";

    app.get(ind, function (req, res) {
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
}