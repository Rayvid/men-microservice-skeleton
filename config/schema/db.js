const joi = require('joi');

module.exports = joi.object({
  wallet_file: joi.string()
    .required(),
}).unknown().required();
