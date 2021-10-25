import helpers from './helpers.js';

 it('Parses JSON to Object', () => {
   let sample = "{}";
   expect(helpers.parseJSON2Obj(sample)).toEqual({});
   sample = '{"key": "value"}';
   expect(helpers.parseJSON2Obj(sample)).toEqual({key: "value"});

 })
