const Exception = require('./Exception');

module.exports = class ModelException extends Exception {
  constructor(
    params,
    defaultParams = {
      message: 'Model exception',
      statusCode: 500,
      innerError: undefined,
      fields: undefined,
    },
  ) {
    super(params, defaultParams);
  }
};
