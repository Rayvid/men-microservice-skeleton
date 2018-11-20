const pkgJson = require('../../package.json');

// You are than welcome to extend this class to customize class name/default message/parameters
// more adequately reflecting your error state
class Exception extends Error {
  constructor(
    // To support patterns new Exception(err)
    // and new Exception({message: '...', innerError: err})
    // we accept these two universally trough first parameter
    params,
    defaultParams = {
      message: 'Exception occured',
      statusCode: 500,
      innerError: undefined,
      fields: undefined,
      // Read about fields purpose in REST communication there:
      // https://lympodev.atlassian.net/wiki/spaces/LYMP/pages/193560577/REST+communication+standards
    },
  ) {
    let constructorParameters = defaultParams;
    if (params && !params.stack) {
      constructorParameters = params;
    }
    super(constructorParameters.message || defaultParams.message);

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
    if (params && params.stack) {
      this.stack += `\n${params.stack}`;
    } else if (constructorParameters.innerError && constructorParameters.innerError.stack) {
      this.stack += `\n${constructorParameters.innerError.stack}`;
    }

    // Saving namespace for exception type comparison (Comparing types itself is tricky in Node)
    this.name = `${pkgJson.name.toUpperCase()}.${this.constructor.name}`;

    // Most commonly it will be HTTP status,
    // but can be any other convention dictated by library throwing it
    this.statusCode = constructorParameters.statusCode || defaultParams.statusCode;
    this.status = this.statusCode; // For backwards compatibility

    // To bubble fields too from originated exception
    this.fields = constructorParameters.fields || params.fields;
  }

  inspect() {
    return {
      name: `${this.name}: ${this.message}`,
      stack: this.stack,
      fields: this.fields,
    };
  }
}

module.exports = Exception;
