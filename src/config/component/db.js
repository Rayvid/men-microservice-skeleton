const joi = require('joi');

const schema = joi.object({
  SQLITE_DB_FILE: joi.string()
    .required(),
}).unknown().required();

const envVars = joi.attempt(process.env, schema);

module.exports = { sqliteDbFile: envVars.SQLITE_DB_FILE };
