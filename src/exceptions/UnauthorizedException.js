import Exception from './Exception.js';

/**
 * @export
 * @class UnauthorizedException
 * @extends {Exception}
 */
export default class UnauthorizedException extends Exception {
  /**
   * Creates an instance of UnauthorizedException.
   * @param {*} params
   * @param {string} [defaultParams={
   *       message: 'Unauthorized',
   *       statusCode: 401,
   *     }]
   * @memberof UnauthorizedException
   */
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
