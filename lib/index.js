// Load modules

var Mongoose = require('mongoose');
var Hoek = require('@hapi/hoek');
var Joi = require('joi');


// Declare internals

var internals = {
    schema: Joi.object({
        mongooseUri: Joi.string().uri().required(),
        mongooseOptions: Joi.object()               // http://mongoosejs.com/docs/api.html#connection-js
    }),
    defaults: {
        mongooseOptions: {useNewUrlParser: true, useUnifiedTopology: true}
    }
};

internals.pkg = require('../package.json');

module.exports = {
  pkg: internals.pkg,
  register: async (server, options) => {

      options = Hoek.applyToDefaults(internals.defaults, options);
      var results = internals.schema.validate(options);
      Hoek.assert(!results.error, results.error);
      var settings = results.value;

      Mongoose.connect(settings.mongooseUri, settings.mongooseOptions);
      var connection = Mongoose.connection;
      const db = Mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error:'));
      db.once('open', function() {
        console.log("MongoDB connection successful");
      });
      server.log(['hapi-mongoose-connect', 'plugin'], 'Database `' + connection.name + '` connected on ' + connection.host + ':' + connection.port);
      server.events.on('stop', () => {
          server.log(['hapi-mongoose-connect', 'plugin'], 'Database `' + connection.name + '` closed');
          connection.close();
      });
      
  }
};