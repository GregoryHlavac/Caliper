var db = require("../models"),
	express = require('express'),
	Sleep = require('sequelize-sleep');
	// For my development of the REST API, don't use this :)
	//Sleep = require('../../../node-sequelize-sleep');

exports.initializeRoutes = function(app)
{
	var slp = new Sleep();

	// Public API shouldn't be able to call any sort of modifications.
	var readOnly = {
		param: true,
		get: true,
		post: false,
		put: false,
		patch: false,
		delete: false
	};

	var publicAPI = slp.createAPI(
		[
			{
				model: db.Project,
				options: {
					walk_associations: true,
					walk_depth: 4,
					defaults: readOnly,
					alternate: 'title',

					associationOptions: {
						releases: {
							alternate: 'version'
						}
					}
				}
			},
			{
				model: db.Release,
				options: {
					walk_associations: false,
					defaults: readOnly
				}
			},
			{
				model: db.Crash,
				options: {
					walk_associations: true,
					walk_depth: 3,
					defaults: readOnly
				}
			},
			{
				model: db.Report,
				options: {
					walk_associations: true,
					defaults: readOnly,
					alternate: 'report_uuid'
				}
			},
			{
				model: db.StackFrame,
				options: {
					walk_associations: false,
					defaults: readOnly
				}
			}
		]
	);
	app.use('/api', publicAPI);


	var adminAPI = slp.createAPI()

	app.use('/admin/api', adminAPI);
}