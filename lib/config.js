/*
 * Create and export configuratio variables
 *
 */

 const environments = {};


 // STAGING ENVIRONMENT (defauçt)
 //
 environments.staging = {
   'envName': 'staging',
   'staging': true,
   'httpPort': 3030,
 };

 // PRODUCTION ENVIRONMENT
 //
environments.production = {
  'envName': 'production',
  'production': true,
  'httpPort': 5050,
}
//
// Find out which environment was passed on command line

const curEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';
console.log("NODE NEV:", curEnv);
//
// Check the environment requested can be Found or defualt to staging

const env2Export = typeof(environments[curEnv]) == 'object' ? environments[curEnv] : environments.staging;
//
// Export the selected environembt

export default env2Export;
