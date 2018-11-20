const log = require('../../util').logger;

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  const errorObj = {
    message: error.message,
    fields: error.fields,
    stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
  };

  const reqInfo = `${req.originalUrl} - ${req.method} - ${req.ip}`;
  log.error({
    status: error.status || 500,
    message: errorObj.message,
    reqInfo,
    fields: errorObj.fields,
    stack: error.stack,
  });
  res.status(error.status || 500).json(errorObj);
};

