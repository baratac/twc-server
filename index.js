/*
 *
 *  -- NodeJS MAster class first example RESTfull API deployment
 *  -- version developed for Teamway Challenge
 */

  //
  // Dependencies

  import http from 'http';
  import url from 'url';
  import  { StringDecoder } from 'string_decoder'; //).StringDecoder;

  import config from './lib/config.js';
  import handlers from './lib/handlers.js';
  import helpers from './lib/helpers.js';
  import data from './lib/data.js'

  
  // START DATABASE
  //

  if (data.init()) {
    console.log("DB OFF");
    process.exit(1);
  }

  //
  // Server should respond to all requests with a string

  //
  // Instantiate HTTP SERVER

  const httpServer = http.createServer( (req, res) => {
    unifiedServer(req, res);
  });
  //
  // RUN HTTP SERVER

  httpServer.listen(config.httpPort, () => {
  	console.log("HTTP Server is now ready to attend requests at port " + config.httpPort);
  });

  // Unified Server logic handlling both http and https requests
  //
  const unifiedServer = function(req, res) {
    // Get URL and parse it

  	const parseUrl = url.parse(req.url, true);

  	// Get the Path

  	const path = parseUrl.pathname;
  	const trimmedPath = path.replace(/^\/+|\/+$/g,'')

  	// Get HTTP Method

  	const method = req.method.toLowerCase();

  	// Get the query string as an object

  	const query = parseUrl.query;

  	// Get header as an object

  	const header = req.headers;

    //
    // The string_decoder module provides an API for decoding Buffer
    // objects into strings in a manner that preserves encoded 
    // multi-byte UTF-8 and UTF-16 characters. 
  	
  	const decoder = new StringDecoder('utf-8');
  	let buffer = '';

    // Get the payload when it's available as ReadableStream Interface
    // by acessing the on and end methods
  	req.on('data', (data) => {
  		buffer += decoder.write(data);
  	});
  	//
  	// Request End handling

  	req.on('end', () => {
  		buffer += decoder.end();

  		// Find the handler to take care of request, if none then use not Found one
  		//
  		let theHandler = typeof(router[trimmedPath]) != 'undefined' ? router[trimmedPath] : handlers.notFound;

  		// Construct data object to send to the request handler
  		//
  		const data = {
  			'method': method,
  			'path': trimmedPath,
  			'headers': header,
  			'payload': helpers.parseJSON2Obj(buffer),
  			'queryString': query
  		}

  		// Route the request to the handler
  		//

  		theHandler(data, function(statusCode, payload) {

  			// Make sure there is a status code to respond
  			//
  			statusCode = typeof(statusCode) === 'number' ? statusCode : 202;


        
        //
  			// Make sure there is an object on payload
        
        payload = (payload != null && typeof(payload) == 'object') ? payload : {};
        
        //
        // Convert payload objecy to string

        const payloadString = JSON.stringify(payload);

        //
        //
        // If it's an OPTIONS REQUEST adjust status code

        if (statusCode === 405 && method === 'options') { // 
          statusCode = 200;
        }

        //
        // SET Header Parameters to handle CORS

        res.setHeader('Content-Type','application/json');
        if (header.origin) {
          res.setHeader('access-control-allow-origin',header.origin);
        }
      
        res.setHeader('access-control-allow-methods', 'PUT, POST, GET, DELETE');
        res.setHeader('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin')
        res.setHeader('access-control-max-age', 2592000)


        // Send back the response

  			res.writeHead(statusCode);
  			res.end(payloadString);

  			// Log response info
  			// console.log('Response sent with code:', statusCode);
  		});

  	});
  };

  //
  // Define http requests handlers

  //
  // Define request router

  const router = {
  	'ping': handlers.ping,
    'query': handlers.query,
    'result': handlers.result
  };
