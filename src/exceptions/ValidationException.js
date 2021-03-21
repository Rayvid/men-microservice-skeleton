import Exception from './Exception.js';

// TODO sample of validation and bubbling fields
/**
 * @export
 * @class ValidationException
 * @extends {Exception}
 */
export default class ValidationException extends Exception {
  /**
   * Creates an instance of ValidationException.
   * @param {*} params
   * @param {string} [defaultParams={
   *       message: 'Parameter(s) not valid',
   *       statusCode: 400,
   *     }]
   * @memberof ValidationException
   */
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
