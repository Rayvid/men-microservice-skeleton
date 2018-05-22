const joi = require('joi');

const schema = joi.object({
  ELASTIC_SEARCH_HOST: joi.string()
    .uri({ scheme: ['http', 'https'] }),
}).unknown().required();

const envVars = joi.attempt(process.env, schema);

module.exports = { host: envVars.ELASTIC_SEARCH_HOST };
