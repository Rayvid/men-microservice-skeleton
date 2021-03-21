import Exception from './Exception.js';

/**
 * @export
 * @class ModelException
 * @extends {Exception}
 */
export default class ModelException extends Exception {
  /**
   * Creates an instance of ModelException.
   * @param {*} params
   * @param {string} [defaultParams={
   *       message: 'Model exception',
   *       statusCode: 500,
   *     }]
   * @memberof ModelException
   */
  constructor(
      params,
      defaultParams = {
        message: 'Model exception',
        statusCode: 500,
      },
  ) {
    super(params, defaultParams);
  }
};
