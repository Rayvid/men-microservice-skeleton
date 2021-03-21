import path from 'path';
import fs from 'fs';

const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

// You are than welcome to extend this class to customize class name/default message/parameters
// to more adequately reflect your error state
/**
 * @export
 * @class Exception
 * @extends {Error}
 */
export default class Exception extends Error {
  /**
   * Creates an instance of Exception.
   * @param {*} params
   * @param {string} [defaultParams={
   *       message: 'Exception occured',
   *       description: undefined,
   *       statusCode: 500,
   *       innerError: undefined,
   *       fields: undefined, // Server validation scenarios and similar, to display field specific issues
   *       doNotaugmentStack: false, // True will save resources if you use throw instead return
   *     }]
   * @memberof Exception
   */
  constructor(
      // Supported patterns:
      //   new Exception(err)
      //   new Exception({message: '...', innerError: err})
      params,
      defaultParams = {
        message: 'Exception occured',
        description: undefined,
        statusCode: 500,
        innerError: undefined,
        fields: undefined, // Server validation scenarios and similar, to display field specific issues
        doNotaugmentStack: false, // True will save resources if you use throw instead return
      },
  ) {
    let constructorParameters = defaultParams;
    if (params && !params.stack) {
      constructorParameters = params; // Parameters must be object
    } else if (params.stack) {
      constructorParameters.innerError = params; // If constructed from exception alone
    }
    super(constructorParameters.message || defaultParams.message);

    if (!constructorParameters.doNotaugmentStack) {
      // Capturing stack trace and excluding constructor call from it.
      // This requires some explanation i believe:
      // implementing exception bubbling trough async code is still
      // painfull in Node. So we are using stacktrace concatenation to workaround that
      //
      // So error handling pattern becomes like:
      // try {
      //   await someAsyncCode...
      // } catch (err) {
      //   throw new Exception(err);
      // }
      //
      // It works with promises too:
      // new Promise((success, failure) => {
      //   originalPromise.then(_ => success(_)).catch(err => failure(new Exception(err)));
      // });
      Error.captureStackTrace(this, this.constructor);
      if (constructorParameters.innerError) {
        this.stack += `\n${constructorParameters.innerError.stack}`;
      }
    }

    if (constructorParameters.innerError) {
      this.cause = constructorParameters.innerError; // 4 Sentry to see
    }

    // Saving namespace for exception type checking scenarios (comparing types is tricky in Node)
    this.name = `${pkgJson.name.toUpperCase()}.${this.constructor.name}`;

    // Most commonly it will be HTTP status code,
    // but can be any other convention dictated by library throwing it
    this.statusCode = constructorParameters.statusCode || defaultParams.statusCode;

    // To bubble description from originated exception
    this.description = constructorParameters.description ||
        (constructorParameters.innerError && constructorParameters.innerError.description);

    // To bubble fields too from originated exception
    this.fields = constructorParameters.fields ||
        (constructorParameters.innerError && constructorParameters.innerError.fields);
  }
}
