var bcrypt = require('bcryptjs'),
	nconf = require('nconf'),
	_ = require('lodash');

module.exports = function(sequelize, types)
{
	var User = sequelize.define('User',
		{
			username: { type: types.STRING, unique: true },
			email: { type: types.STRING, unique: true },
			password: { type: types.STRING },
			privileges: { type: types.STRING }
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
							.success(function(){ callback(); })
							.error(function(err) { callback(err); });
					}
					else callback("Existing password mismatch.");
				},
				hasPrivilege: function(privilege) {
					return _.indexOf(this.getDataValue('privileges').split('|'), privilege) != -1;
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
								return done(null, false, { message: "Password Invalid" });
						}
					}).error(function(err) {
						return done(err);
					});
				},
				CreateNew: function(username, email, password, successCallback, errorCallback) {
					User.create({ username: username, password: bcrypt.hashSync(password, nconf.get('bcrypt_salt_size')), email: email})
						.success(successCallback)
						.error(errorCallback);
				},
				// Mostly here because I'm a lazy SOB
				CreateAdmin: function(username, email, password, successCallback, errorCallback) {
					User.create({ username: username, password: bcrypt.hashSync(password, nconf.get('bcrypt_salt_size')), email: email, privileges: 'admin'})
						.success(successCallback)
						.error(errorCallback);
				},
				Defer: {
					Exists: function(username) {
						return User.count({where: { username: username }});
					},
					GetByUsername: function(username) {
						return User.find({ where: {username: username }});
					}
				}
			}
		});

	return User;
}