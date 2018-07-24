const joi = require('joi');

module.exports = joi
  .object({ dsn: joi.string().uri({ scheme: ['https'] }) })
  .unknown()
  .required();
