var
	fs = require('fs'),
	path = require('path'),
	nconf = require('nconf'),
	chai = require('chai'),
	should = chai.should(),
	db = {};

chai.use(require('chai-as-promised'));

describe("Database", function() {

	// Setup the defaults for our in-memory SQLite Database for testing.
	before(function() {
		nconf.defaults(
			{
				"bcrypt_salt_size": 10,
				"database": {
					"db": "caliper",
					"username": "",
					"password": "",
					"options": {
						"dialect": "sqlite",
						"logging": false
					}
				}
			}
		);

		db = require("../models");
	});

	it("Initialization", function(done) {
		db.sequelize.sync().complete(function(err) {
			if (err)
				done(err);
			else
				done();
		});
	});

	describe('→ User', function() {
		var testUser;

		before(function(done) {
			db.User.CreateNew("test", "test@test.com", "testpassword", function(usr) {
				testUser = usr;
				done();
			}, function(err) {
				done(err);
			});
		});

		it("Username 'test' exists", function(done) {
			db.User.Defer.Exists('test').should.eventually.equal(1).and.notify(done);
		});

		it("Username 'fail' should not exist", function(done) {
			db.User.Defer.Exists('fail').should.eventually.not.be.equal(1).and.notify(done);
		});

		it("Username 'test' has password 'testpassword'", function() {
			return testUser.verifyPassword('testpassword');
		});

		it("Username 'test' doesn't have password 'test'", function() {
			return !testUser.verifyPassword('test');
		});
	});

	after(function() {

	});
});