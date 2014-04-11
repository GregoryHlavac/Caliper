var bcrypt = require('bcryptjs'),
	nconf = require('nconf');

module.exports = function(sequelize, types)
{
	var User = sequelize.define('User',
		{
			username: { type: types.STRING, unique: true },
			email: { type: types.STRING, unique: true },
			password: { type: types.STRING }
		},
		{
			timestamps: false,
			instanceMethods: {
				verifyPassword: function(pw) {
					return bcrypt.compareSync(pw, this.password);
				},
				updatePassword: function(oldPw, newPw, callback) {
					if(this.verifyPassword(oldPw))
					{
						this.updateAttributes({ password: bcrypt.hashSync(newPw, nconf.get('bcrypt_salt_size')) }, ['password'])
							.success(function(){ callback(null); })
							.error(function(err) { callback(err); });
					}
					else callback("Existing password mismatch.");
				}
			},
			classMethods: {
				LocalLoginHandler: function(req, usr, pass, done) {
					User.find({ where: { username: usr }}).success(function(user) {
						if(!user)
							return done(null, false, { message: "Username Invalid" });
						else
						{
							if(user.verifyPassword(pass))
								return done(null, user);
							else
								return done(null, false, { message: "Username Invalid" });
						}
					}).error(function(err) {
						console.log("Error in login Handler.. Somehow?");
						return done(err);
					});
				}
				//getLimited: function(pid, count, successCallback, errorCallback)
			}
		});

	return User;
}