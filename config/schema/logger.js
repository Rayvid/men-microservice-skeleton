import joi from 'joi';

export default joi.object({
  dir: joi.string()
      .default('logs'),
  fileName: joi.string()
      .default('combined.log'),
  level: joi.object({
    file: joi.string()
        .allow(...['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
        .default('info'),
    console: joi.string()
        .allow(...['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
        .default('info'),
  }).unknown().required(),
}).unknown().required();
