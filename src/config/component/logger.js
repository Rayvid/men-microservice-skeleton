const joi = require('joi');

const schema = joi.object({
  LOG_DIR: joi.string()
    .default('logs'),
  LOG_FILE_NAME: joi.string()
    .default('combined.log'),
  LOG_LEVEL_FILE: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  LOG_LEVEL_ELASTIC: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
  LOG_LEVEL_CONSOLE: joi.string()
    .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .default('info'),
}).unknown().required();

const envVars = joi.attempt(process.env, schema);

module.exports = {
  dir: envVars.LOG_DIR,
  fileName: envVars.LOG_FILE_NAME,
  level: {
    file: envVars.LOG_LEVEL_FILE,
    elastic: envVars.LOG_LEVEL_ELASTIC,
    console: envVars.LOG_LEVEL_CONSOLE,
  },
};
