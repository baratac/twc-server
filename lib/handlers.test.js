import handlers_module from './handlers.js';
import data_module from './data.js';

//
// Start Database for tests

beforeAll(() => {
    data_module.init();
});

//
// Query Get to get  next/previous question

test('Query Get question 5', done => {

    function callback(status_code, data) {
        try {
            expect(data.id).toBe(5);
            done();
        } catch (err) {
            done(err);
        }
    }
    const data = {queryString: { current: 5}};
    handlers_module._query.get(data, callback);
});

//
// Execute Post to start new questionaire session

let test_sid = '';

test('Post Result to start new session', done => {
    function callback(status_code, payload) {
        try {
            
            test_sid = payload.sid; // New Session ID Return
            expect(status_code).toBe(200);
            done();
        } catch (err) {
            done(err);
        }
    }
    const data = {payload: {test: "post"}};
    handlers_module._result.post(data, callback);
});

test('Put Result updates test session', done => {

    function callback(status_code, payload) {
        try {
            expect(status_code).toBe(200);
            done();
        } catch (err) {
            done(err);
        }
    }
    const data = {payload: {sid: test_sid, answers: { 4:"3" }} };
    handlers_module._result.put(data, callback);
});


test('Delete Result test session', done => {

    function callback(status_code) {
        try {
            expect(status_code).toBe(200);
            done();
        } catch (err) {
            done(err);
        }
    }
    // console.log("TEST SID", test_sid);
    const data = {queryString: {sid: test_sid}}; 
    handlers_module._result.delete(data, callback);
});