const joi = require('joi');

const schema = joi.object({
  NODE_ENV: joi.string()
    .allow(['development', 'test', 'production'])
    .default('development'),
  PORT: joi.number()
    .default(3000),
}).unknown().required();

const envVars = joi.attempt(process.env, schema);

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
};
