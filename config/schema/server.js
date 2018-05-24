const joi = require('joi');

module.exports = joi.object({
  env_name: joi.string()
    .allow(['development', 'test', 'production'])
    .default('development'),
  port: joi.number()
    .default(3000),
}).unknown().required();

