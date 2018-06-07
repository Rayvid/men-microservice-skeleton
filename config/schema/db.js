const joi = require('joi');

module.exports = joi.object({
  walletFile: joi.string()
    .required(),
}).unknown().required();
