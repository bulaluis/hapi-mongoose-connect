// Load modules

var Mongoose = require('mongoose');
var Hoek = require('hoek');
var Joi = require('joi');


// Declare internals

var internals = {
	schema: Joi.object({
		uri: Joi.string().uri().required(),
		options: Joi.object().optional().default({})	// http://mongoosejs.com/docs/api.html#connection-js
	})
};


exports.register = function (server, options, next) {
	var results = Joi.validate(options, internals.schema);
	Hoek.assert(!results.error, results.error);
	var settings = results.value;

	Mongoose.connect(settings.uri, settings.options, function (err) {

		Hoek.assert(!err, err);

		var connection = Mongoose.connection;
		server.log('hapi-mongoose-connect', 'Database `' + connection.name + '` connected on ' + connection.host + ':' + connection.port);


		server.on('stop', function () {

			server.log('hapi-mongoose-connect', 'Database `' + connection.name + '` closed');
			connection.close();
		});

		next();
	});
};


exports.register.attributes = {
	pkg: require('../package.json')
};
