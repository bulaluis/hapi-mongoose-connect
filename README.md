# hapi-mongoose-connect

Mongoose connection for hapi.js

## Install

```bash
$ npm install hapi-mongoose-connect
```

## Usage

```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ port: 8000 });

server.register({
		register: require('hapi-mongoose-connect'),
		options: {
			mongooseUri: 'mongodb://localhost/my-database',
			mongooseOptions: {}		// http://mongoosejs.com/docs/connections.html
		}
	}, function (err) {

    	if (err) {
    		throw err;
    	}

    	server.start(function (err) {

    	    if (err) {
    	        throw err;
    	    }
    	    console.log('Server started at: ' + server.info.uri);
    	});
    }
});
```

## Tests
Run comand `make test` or `npm test`. Include 100% test coverage.

# License
MIT
