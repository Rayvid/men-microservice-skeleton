import joi from 'joi';

export default joi.object({
  envName: joi.string()
      .allow(...['development', 'test', 'production'])
      .default('development'),
  listenOnPort: joi.number()
      .default(80),
}).unknown().required();
