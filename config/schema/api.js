const joi = require('joi');

module.exports = joi.object({
  version: joi.number()
    .default(1),
}).unknown().required();
