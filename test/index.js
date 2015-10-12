// Load modules

var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Plugin = require('../lib');
var Mongoose = require('mongoose');


// Tests

var lab = exports.lab = Lab.script();
var options = {
	uri: 'mongodb://localhost/test-hapi-mongoose'
}
var server;


lab.before(function (done) {

	server = new Hapi.Server();
	server.connection({ port: 3000 });
	return done();
});


lab.experiment('Hapi-mongoose Plugin', function () {

	lab.test('successfully registered', function (done) {

		server.register({
			register: Plugin,
			options: options
		}, function (err) {

			Code.expect(err).to.not.exist();
			return done();
		});
	});

	lab.test('mongoose.connection it has been connected', function (done) {

		Code.expect(Mongoose.connection.readyState).to.be.equal(Mongoose.STATES['connected']);	
		
		return done();
	});

	lab.test('on server stop mongoose.connection it has been disconnected', function (done) {

		server.stop(function (err) {
			
			Code.expect(err).to.not.exist();
			Code.expect(Mongoose.connection.readyState).to.be.equal(Mongoose.STATES['disconnected']);			
			return done();
		});
	});
});
