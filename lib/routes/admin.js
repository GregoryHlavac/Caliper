var database = require("../models"),
	auth = require('../authentication'),
	_ = require('lodash'),
	Project = database.Project,
	Backlog = database.Backlog,
	express = require('express'),
	passport = require('passport'),
	Sleep = require('sequelize-sleep'),
	User = database.User,
	passport = require('passport'),
	multiparty = require('multiparty'),
	fs = require('fs'),
	mkdirp = require('mkdirp'),
	LineByLineReader = require('line-by-line'),
	LocalStorage = require('passport-local').Strategy;

exports.initializeRoutes = function(app)
{
	var slp = new Sleep();
	var adminRouter = express.Router();

	adminRouter.use(passport.initialize());
	adminRouter.use(passport.session());

	passport.use('admin-login', new LocalStorage(
			{
				passReqToCallback: true
			},
			User.LocalLoginHandler)
	);

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.find(id).success(function(user) {
			done(null, user);
		}).error(function(err) {
			done(err);
		});
	});

	adminRouter.post('/auth', auth.admin.login);
	adminRouter.delete('/auth', auth.logout);
	adminRouter.get('/auth', auth.admin.check, auth.session);

	adminRouter.post('/symbol_upload', auth.admin.check, function(req, res) {
		var cdOpts = {
			autoFiles: true,
			autoFields: true
		};

		var form = new multiparty.Form(cdOpts);

		form.parse(req, function(err, fields, files) {
			if(err) {
				console.log(err);
				res.header('Connection', 'close');
				res.send(413, "Error");
				return;
			}
			res.send({ success: true });


			_.forOwn(files, function(f) {
				var tmpSymFile = f[0];

				var originalFilename = tmpSymFile.originalFilename;
				var fromFile = tmpSymFile.path;

				var lr = new LineByLineReader(fromFile);

				var flRead = false;

				lr.on('error', function(err) { throw err; });
				lr.on('line', function(line) {
					lr.pause();

					if(!flRead) {
						flRead = true;
						var parts = line.split(' ');

						var moduleID = parts[3];
						var moduleName = parts[4];

						// TODO: implement custom symbol directories?

						var targetDirectory = './symbols/' + moduleName + '/' + moduleID;

						mkdirp(targetDirectory, function(err) {
							if(!err) {
								var source = fs.createReadStream(fromFile);
								var dest = fs.createWriteStream(targetDirectory + '/' + originalFilename);

								source.pipe(dest);
								source.on('end', function() {
									fs.unlink(fromFile, function(err) {
										if(err) throw err;
									})
								});
								source.on('error', function(err) { throw err; });
								return;
							}
							else throw err;
						});
					}
					lr.close();
				});
			});
		});
	});

	if(app.nconf.get('enable_create_admin')) {
		adminRouter.post('/create_admin/:passcode', function(req, res) {
			var pq = req.params.passcode;

			if(app.nconf.get('enable_create_admin') === pq &&
				req.param('username') &&
				req.param('password') &&
				req.param('email'))
			{
				User.CreateAdmin(req.param('username'), req.param('email'), req.param('password'),
					function(user) {
						res.send(200);
					}, function(err) {
						res.send(500, err);
					});
			}
			else {
				res.send(500);
			}
		});
	}

	var adminAPI = slp.createAPI(
		[

		],
		auth.admin.check
	);

	adminRouter.use('/api', adminAPI);

	adminRouter.get('/*', function (req, res)
	{
		res.render("admin/index",
			{
				page_title: "Caliper :: Control Panel"
			}
		);
	});

	app.use('/admin', adminRouter);
}