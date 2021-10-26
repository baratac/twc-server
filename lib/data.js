/*
 * Library for storing and editing data
 *
 */

// Dependencies

  import { nanoid } from 'nanoid';
  import lodash from 'lodash';
  import { join, dirname } from 'path'
  import { LowSync, JSONFileSync } from 'lowdb'
  import { fileURLToPath } from 'url'

  const SID_LEN = 10 // Session ID length
  const __dirname = dirname(fileURLToPath(import.meta.url));

  // Use JSON file for storage
  const file = join(__dirname, '../.data/db.json');
  const adapter = new JSONFileSync(file)
  const db = new LowSync(adapter)

 //
 // Container for the module (to be exported)

 const lib = {};

 // Startup in memory DB
 // 
 //
 lib.init = function() {
     try {
       db.read();
       if (db.data === null) {
         console.log("Data File missing Initiate DB");
         db.data = { questions: [], sessions: {}, count: 0 };
         db.write();
       }
       db.chain = lodash.chain(db.data);
       return false;
     }
     catch (err) {
       console.log("Error starting DB", err);
       return true;
     }
 }

  // Update DB To file
  //
  lib.updateDB = function() {

    try {
      db.write();
      return false;
    } catch (err) {
      return 'Failed to update DB to file';
    }
  }

  // Read Question Record
  //
  lib.readQuestion = function(qid, callback) {

    try {
      const qRecord = db.chain
         .get('questions')
         .find({id: qid})
         .value()
      // console.log("Question", qid, qRecord);
      callback(false, qRecord);
    }
    catch (err) {
      console.log("Exception reading DB", err);
      callback('ERROR querying DB');
    }
  }

  // Initializes session data to record quiz results
  //
  // Require data: none
  // Optional data: sessionInfo may carry additional details of the session
  // 
  lib.createSession = function(sessionInfo, callback) {

      try{
        const sessionId = nanoid(SID_LEN);
        const { sessions } = db.data;
        const newSession = { id: sessionId, start: new Date(), ...sessionInfo, answers: {}};

        sessions.push(newSession);
       
        // db.write();
        callback(false, sessionId);
      }
      catch(err) {
        console.log("ERROR Creating Session", err);
        callback('Failed create new session');
      };
  }

 // Update Session record
 //
 // Require data: session ID, data to update 
 // Optional data: none
 //
 lib.updateSession = function(sid, data, callback) {

   try {

    let sRecord = db.chain
        .get('sessions')
        .find({id: sid})
        .value()

    delete data.sid;
    
    if (sRecord != undefined) {
      sRecord = lodash.merge(sRecord, data);
      sRecord.lastUpdate = new Date(); 
     
      db.chain
         .get('sessions')
         .find({id: sid})
         .assign(sRecord)
         .value()
      // db.write()
      callback(false);
    }
    else {
      callback('No Session found to update');
    }
   } catch (err) {
     console.log("Updating session error", err);
     callback('Failed to update session');
   }
 }

 // Deleting Session record
 //
 lib.deleteSession = function(sid, callback) {
   try {

     db.chain
        .get('sessions')
        .remove({id: sid})
        .value()
     // db.write()
     callback(false);
   } catch (err) {
     callback('Failed to delete session')
   }
 }
 //
 // Export the module

export default lib ;
