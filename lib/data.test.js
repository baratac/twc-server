import data_module from './data.js';

//
// Starting DB

test('Initialize the db object', () => {
  const result = data_module.init();
  expect(result).toBeFalsy();
});

//
// TEST Create/Delete Session function

let sid;
test('Create New Session', done => {
  function callback(err, sessionId) {
    try {
      expect(sessionId).toBeDefined();
      sid = sessionId;
      done();
    } catch (err) {
      done(err);
    }
  }
  data_module.createSession({test: '003'}, callback);
});

//
// Test Update using sid from create test

test('Update Session', done => {
  function callback(status) {
    try {
      expect(status).toBeFalsy();
      done();
    } catch (err) {
      done(err);
    }
  }
  data_module.updateSession(sid, {1:1}, callback);
});

//
// Test Delete Session From Create Test

test('Delete Session', done => {
  function callback(status) {
    try {
      expect(status).toBeFalsy();
      done();
    } catch (err) {
      done(err);
    }
  }
  data_module.deleteSession(sid, callback);
});

//
// Read question test

test('Read Second Question', done => {
    function callback(err, question) {
      try {
        expect(question).toBeDefined();
        done();
      }
      catch(err) {
        done(err);
      }
    }
    
    data_module.readQuestion(2, callback);
});

// it.todo('Create session ');
