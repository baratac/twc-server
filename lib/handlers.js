/*
 * Request Handlers
 *
 */

 //
 // Dependencies *************


 import _data from './data.js';
 //
 // Handlers Descriptor ******


const handlers = {}

// ******* Handlers CODE BODY
// **************************

handlers.query = (data, callback) => {
  const accetptableMethods = new Set(['get']);

  if (accetptableMethods.has(data.method)) {
    handlers._query[data.method](data, callback);
  } else {
    callback(405);
  }
}

handlers.result = (data, callback) => {
  const accetptableMethods = new Set(['post','put', 'delete']);
  
  if (accetptableMethods.has(data.method)) {
    handlers._result[data.method](data, callback);
  } else {
    callback(405);
  }
}

//
// Container for Questions and Answers(Q&A) sub-methods
handlers._query = {};
handlers._result = {};

// Query utility functions
//

function validateQuery(info) {

  if (typeof(info.direction) === 'string' && !isNaN(info.current)) {
    return (info.direction.toLowerCase() === 'forward' || info.direction.toLowerCase() === 'backward');
  }
  return false;
}

// Query.Get
//
// Required Data: on query string direction and  current value
// Optional Data: none
// ------------
// @TODO&
//
handlers._query.get = (data, callback) => {

  const questionNum = Number(data.queryString.current);

  if (questionNum != NaN) {
    _data.readQuestion(questionNum, (err, qInfo) => {
      //console.log("Return from DB", err, qInfo);
      if (qInfo != undefined) {
        callback(200, qInfo);
      } else {
        callback(404);
      }

    })
  } else {
    callback(400, {'Error': 'query data missing or invalid format'})
  }
};

// Results.Post
//
// Objective: To start a new query with additional session details
// Required data: none
// Optional data: none
//
handlers._result.post = (data, callback) => {

    
    _data.createSession(data.payload, (err, sessionId) => {
      if (!err) {
       
        callback(200, {'sid': sessionId});
      } else {
        callback(500, {'Error': 'Error Session Creation Operation'});
      }
    });
};

// Result.Put
//
// Required Data:
// Optional Data: at least one of the others name or password
// -------------
// @TODO@ Only Authenticated USers can change their own data
//
handlers._result.put = (data, callback) => {
  const resultInfo = data.payload;

  if (typeof(resultInfo.sid) === 'string')
  {
    _data.updateSession(resultInfo.sid, resultInfo, (err) => {
      if (!err) {
        callback(200, {'sid': resultInfo.sid});
      } else {
        console.log(err);
        callback(500, {'Error': 'Failed to update session data'});
      }
    });
  }
  else {
    callback(400, {'Error': 'Not valid session id to update'});
  }
};
// Users.Delete
//
// Required Data: Phone
// Optional Data: none

handlers._result.delete = (data, callback) => {
  const resultInfo = data.queryString;

  if (typeof(resultInfo.sid) === 'string') {

    _data.deleteSession(resultInfo.sid, (err) => {
      callback(200);
    })
  }
  else {
    callback(400, {'Error': 'Not valid session id to update'});
  }

};
// Ping handler
//
handlers.ping = function (date, callback) {

	callback(200);
};

// Not Found Handler
//
handlers.notFound = function (data, callback) {
	callback(404);
}


// MODULE EXPORTS *************
//
export default handlers;
