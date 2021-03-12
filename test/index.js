// Load modules

var Lab = require('@hapi/lab');
var Code = require('@hapi/code');
var Hapi = require('@hapi/hapi');
var Hoek = require('@hapi/hoek');
var Plugin = require('../lib');
var Mongoose = require('mongoose');


// Tests

var lab = exports.lab = Lab.script();
var server;

lab.experiment('Hapi-mongoose Plugin', () => {

    lab.before(async () => {
      server = Hapi.server({ port: 3000 });  
      await server.start();
      server.events.on('log', (event, tags) => {      
              console.log(event);
      });
    });

    lab.test('successfully registered', async () => {

        await server.register({
            plugin: Plugin,
            options: {
                mongooseUri: 'mongodb://localhost/test-hapi-mongoose'
            }
        });

    });

    lab.test('mongoose.connection it has been connected', async () => {
      while (Mongoose.connection.readyState === Mongoose.STATES['connecting']) {
        await Hoek.wait(100);
      }
      Code.expect(Mongoose.connection.readyState).to.be.equal(Mongoose.STATES['connected']);
    }); 

    lab.test('on server stop mongoose.connection it has been disconnected', async () => {
        await server.stop();   
        while (Mongoose.connection.readyState === Mongoose.STATES['disconnecting']) {
          await Hoek.wait(100);
        }        
        Code.expect(Mongoose.connection.readyState).to.be.equal(Mongoose.STATES['disconnected']);
    });
});
