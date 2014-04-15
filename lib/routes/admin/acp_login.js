var User = require("../../models").User,
	express = require('express'),
	passport = require('passport'),
	LocalStorage = require('passport-local').Strategy;

exports.initializeRoutes = function(app)
{
	var acpLogin = express.Router();

	acpLogin.get('/', function(req, res) {
		res.render('admin/login', {
			page_title: "Caliper :: ACP Login"
		});
	});

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

	acpLogin.post('/', passport.authenticate('admin-login', { successRedirect: '/admin/login/check', failureRedirect: '/admin/login', failureFlash: true}));

	function authenticatedOrNot(req, res, next) {
		if(req.isAuthenticated()){
			console.log(req.user);

			next();
		}
		else{
			res.redirect("/admin/login");
		}
	}

	acpLogin.get('/check', authenticatedOrNot, function(req, res) {
		res.send("You're logged in.");
	});

	app.use('/admin/login', acpLogin);
}