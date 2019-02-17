const joi = require('joi');

module.exports = joi.object({
  fullConnString: joi.string().allow('').default(''),
  schema: joi.string().required(),
  host: joi.string().required(),
  user: joi.string().allow('').default(''),
  password: joi.string().allow('').default(''),
  port: joi.string().allow('').default(''),
  database: joi.string().required(),
  params: joi.string().allow('').default(''),
}).unknown().required();
