var db = require("../../models"),
	express = require('express'),
	passport = require('passport');

exports.initializeRoutes = function(app)
{
	var adminRouter = express.Router();

	adminRouter.use(passport.initialize());
	adminRouter.use(passport.session());


	adminRouter.get('/', function (req, res)
	{
		res.render("admin/index",
			{
				page_title: "Caliper :: Control Panel"
			});
	});

	app.use('/admin', adminRouter);
}