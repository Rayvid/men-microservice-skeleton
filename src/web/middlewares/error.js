const log = require('../../util').logger;

/* eslint-disable no-unused-vars */
module.exports = (err, req, res, next) => {
  /* eslint-enable no-unused-vars */
  log.error(
    `${err.status || err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
    [ // This is to log error in one batch (avoid making multiple log.error calls)
      // (becomes important when sending to networked sinks)
      (err.fields) ? `fields: ${JSON.stringify(err.fields)}` : undefined,
      err.stack,
    ].reduce((result, _) => result + ((_) ? `\n${_}` : '')),
  );

  const errorObj = { message: err.message };
  res.status(err.status || err.statusCode || 500);
  if (err.stack && process.env.NODE_ENV !== 'production') {
    errorObj.stack = err.stack;
  }

  res.json(errorObj);

  // No next call - we already started output, so no meaningfull continuation possible
};
