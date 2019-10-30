const Exception = require('./Exception');

module.exports = class ValidationException extends Exception {
  constructor(
    params,
    defaultParams = {
      message: 'Parameter(s) not valid',
      statusCode: 400,
    },
  ) {
    super(params, defaultParams);
  }
};
