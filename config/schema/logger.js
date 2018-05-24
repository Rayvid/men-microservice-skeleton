const joi = require('joi');

module.exports = joi.object({
  log_dir: joi.string()
    .default('logs'),
  log_file_name: joi.string()
    .default('combined.log'),
  level: joi.object({
    file: joi.string()
      .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default('info'),
    elastic: joi.string()
      .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default('info'),
    console: joi.string()
      .allow(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
      .default('info'),
  }).unknown().required(),
}).unknown().required();

