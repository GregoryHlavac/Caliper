var
	fs = require('fs'),
	path = require('path'),
	nconf = require('nconf'),
	chai = require('chai'),
	should = chai.should(),
	chaiAsPromised = require('chai-as-promised'),
	db = {};

chai.use(chaiAsPromised);

describe("Database", function() {
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

	it("Database Initialization", function(done) {
		db.sequelize.sync().complete(function(err) {
			if (err)
				done(err);
			else
				done();
		});
	});

	describe('# User', function() {
		before(function(done) {
			db.User.CreateNew("test", "test@test.com", "testpassword", function(usr) {
				done();
			}, function(err) {
				done(err);
			});
		});

		it("Username 'test' Exists?", function(done) {
			db.User.Promise.Exists('test').should.eventually.equal(1).notify(done);
		});

		it("Username 'test' has password 'testpassword'", function(done) {
			db.User.Promise.GetByUsername('test').success(function(usr) {
				usr.verifyPassword('testpassword').should.equal(true);
				done();
			}).error(function(err) {
				done(err);
			});
		});

		it("Username 'test' doesn't have password 'test'", function(done) {
			db.User.Promise.GetByUsername('test').success(function(usr) {
				usr.verifyPassword('test').should.not.equal(true);
				done();
			}).error(function(err) {
				done(err);
			});
		});

		it("Username 'fail' should not exist.", function(done) {
			db.User.Promise.Exists('fail').should.eventually.not.be.equal(1).to.notify(done);
		});
	});

	after(function() {

	});
});