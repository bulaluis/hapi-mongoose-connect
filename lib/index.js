// Load modules

var Mongoose = require('mongoose');
var Hoek = require('hoek');
var Joi = require('joi');


// Declare internals

var internals = {
    schema: Joi.object({
        mongooseUri: Joi.string().uri().required(),
        mongooseOptions: Joi.object()               // http://mongoosejs.com/docs/api.html#connection-js
    }),
    defaults: {
        mongooseOptions: {}
    }
};


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults(internals.defaults, options);
    var results = Joi.validate(options, internals.schema);
    Hoek.assert(!results.error, results.error);
    var settings = results.value;

    Mongoose.connect(settings.mongooseUri, settings.mongooseOptions, function (err) {

        Hoek.assert(!err, err);

        var connection = Mongoose.connection;
        server.log(['hapi-mongoose-connect', 'plugin'], 'Database `' + connection.name + '` connected on ' + connection.host + ':' + connection.port);


        server.on('stop', function () {

            server.log(['hapi-mongoose-connect', 'plugin'], 'Database `' + connection.name + '` closed');
            connection.close();
        });

        next();
    });
};


exports.register.attributes = {
    pkg: require('../package.json')
};
