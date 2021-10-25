/*
 *
 * Helpers with multiple purposes
 *
 */

 //
 // Dependencies

 //
 // Main Helpers Container

 const helpers = {};

// Parse JSON to an Object avoid throwing exeptions
//
helpers.parseJSON2Obj = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
}

//
// Container EXPORTS

 export default helpers;
