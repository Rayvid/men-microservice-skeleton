const joi = require('joi');

module.exports = joi.object({
  host: joi.string()
    .uri({ scheme: ['http', 'https'] }),
}).unknown().required();

