var passport = require('passport');


exports.session = function(req, res) {
	res.json(200, {
		name: req.user.username,
		privileges: req.user.privileges.split('|')
	});
};

exports.logout = function(req, res) {
	if(req.user) {
		req.logout();
		res.json(200, { message: "Successfully Logged Out."});
	}
	else {
		res.json(400, { message: "Not logged in."});
	}
};

exports.admin = {
	check: function(req, res, next) {
		if(req.isAuthenticated())
		{
			if(req.user.hasPrivilege('admin'))
				next();
			else
				res.json(403, { message: "You aren't an administrator."});
		}
		else
		{
			res.json(403, { message: "You aren't logged in."});
		}
	},
	login: function(req, res, next) {
		passport.authenticate('admin-login', function(err, user, info) {
			var error = err;
			if (error)
			{
				return res.json(500, error);
			}

			req.logIn(user, function(err) {
				if (err)
				{ return res.json(400, info); }
				return exports.session(req, res);
			});
		})(req, res, next);
	}
};