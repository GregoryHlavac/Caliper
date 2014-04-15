exports.checkAuthentication = function(req, res, next)
{
	if(req.isAuthenticated()) {
		next();
	}
	else{
		res.redirect("/admin/login");
	}
}