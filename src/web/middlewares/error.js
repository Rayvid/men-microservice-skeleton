const { logger: log } = require('../../util');

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  const parseForwardedFor = (value) => {
    if (!value) {
      return undefined;
    }

    const commaIndex = value.indexOf(',');
    return commaIndex === -1 ? value : value.substr(0, commaIndex);
  };

  const errorObj = {
    message: error.message,
    description: error.description,
    fields: error.fields,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  };

  const reqInfo = `${req.originalUrl} - ${req.method}`
    + ` - ${parseForwardedFor(req.headers['x-forwarded-for']) || req.connection.remoteAddress}`;
  log.error({
    status: error.statusCode || 500,
    message: errorObj.message,
    description: error.description,
    reqInfo,
    fields: errorObj.fields,
    stack: error.stack,
  });

  // TODO if accept text/html - output nice error screen
  res.status(error.statusCode || 500).json(errorObj);
};
