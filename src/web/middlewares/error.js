const log = require('../../util').logger;

/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  log.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    err.stack ? `\n${err.stack}` : '\n<No error stack available>',
  );

  const errorObj = { message: err.message };
  res.status(err.status || 500);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    errorObj.stack = err.stack;
  }

  res.json(errorObj);

  // No next call - we already started output, so no meaningfull continuation possible
};
