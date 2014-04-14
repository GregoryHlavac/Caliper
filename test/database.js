var should = require('should'),
	fs = require('fs'),
	path = require('path'),
	Sequelize = require('sequelize'),
	db = {},
	sequelize;


describe("Database", function() {
	before(function() {
		sequelize = new Sequelize("caliper", "", "", { dialect: 'sqlite', logging: false});

		var modelDirectory = path.join(__dirname, "..", "models");

		fs
			.readdirSync(modelDirectory)
			.filter(function(file) {
				return (file.indexOf('.') !== 0) && (file !== 'index.js');
			})
			.forEach(function(file) {
				var model = sequelize.import(path.join(modelDirectory, file));
				db[model.name] = model;
			});

		Object.keys(db).forEach(function(modelName) {
			if ('associate' in db[modelName]) {
				db[modelName].associate(db);
			}
		});

		db.sequelize = sequelize;
		db.Sequelize = Sequelize;
	});

	it("Should have initialized the database.", function(done) {
		db.sequelize.sync().complete(function(err) {
			if (err)
				done(err);
			else
				done();
		});
	});

	describe('> User', function() {
		before(function(done) {
			db.User.create({ username: "lolol", email: "test@test.com", password: "testpass" }).success(function(usr) {
				should.exist(usr);
				done();
			}).error(function(err) {
				done(err);
			});
		});

		it("Should have a user called 'lolol'", function(done) {
			db.User.find({ where: { username: "lolol" }}).success(function(usr) {
				should.exist(usr);
				done();
			}).error(function(err) {
				done(err);
			});
		});

		it("Should not have a user called 'trolol'", function(done) {
			db.User.find({ where: { username: "trolol" }}).success(function(usr) {
				should.not.exist(usr);
				done();
			}).error(function(err) {
				done(err);
			});
		});
	});

	after(function() {

	});
});