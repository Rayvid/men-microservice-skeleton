const Exception = require('./Exception');

module.exports = class UnauthorizedException extends Exception {
  constructor(
    params,
    defaultParams = {
      message: 'Unauthorized',
      statusCode: 401,
    },
  ) {
    super(params, defaultParams);
  }
};
