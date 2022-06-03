import path from 'path';
import fs from 'fs';

const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json')));

// It's recommended to extend this class to better reflect your error context
/**
 * @export
 * @class Exception
 */
export default class Exception {
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
      // Supported initialization patterns:
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
    this.errorMessage = (constructorParameters.message || defaultParams.message);

    if (!constructorParameters.doNotaugmentStack) {
      // Capturing stack trace and excluding constructor call from it.
      // This could require some explanation:
      // implementing exception bubbling in async code is still painfull in Node.
      // it was somewhat resolved with --async-stack-traces
      // but OO Exception approach (wrapping) is more versatile.
      // So we are using dumb stacktrace concatenation to achieve that
      //
      // In case you are not fimiliar what exception wrapping is:
      // try {
      //   await someAsyncCode...
      // } catch (err) {
      //   throw new Exception(err);
      // }
      Error.captureStackTrace(this, this.constructor);
      if (constructorParameters.innerError) {
        this.capturedStack = this.capturedStack ? this.capturedStack +`\n${constructorParameters.innerError.stack}` : constructorParameters.innerError.stack;
      }
    }

    if (constructorParameters.innerError) {
      this.cause = constructorParameters.innerError; // 4 Sentry to see original cause
    }

    // Add module name in case you will need to handle exception by exact source
    this.name = `${pkgJson.name.toUpperCase()}.${this.constructor.name}`;

    // Most commonly it will be HTTP status code,
    // but can be any other convention dictated by library throwing it
    this.statusCode = constructorParameters.statusCode || defaultParams.statusCode;

    // To bubble description from originated exception
    this.description = constructorParameters.description ||
        (constructorParameters.innerError && constructorParameters.innerError.description);

    // To bubble fields from originated exception
    this.fields = constructorParameters.fields ||
        (constructorParameters.innerError && constructorParameters.innerError.fields);
  }
}
