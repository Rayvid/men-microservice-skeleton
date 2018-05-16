const joi = require('joi');

const schema = joi.object({
  API_VERSION: joi.number()
    .default(1),
}).unknown().required();

const envVars = joi.attempt(process.env, schema);

module.exports = { version: envVars.API_VERSION };
