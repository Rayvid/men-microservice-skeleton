const Exception = require('./Exception');

module.exports = class UnauthorizedException extends Exception {
  constructor(
    params,
    defaultParams = {
      message: 'Unauthorized',
      statusCode: 403,
    },
  ) {
    super(params, defaultParams);
  }
};
