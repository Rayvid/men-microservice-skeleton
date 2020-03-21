const { logger: log } = require('../../util');

// eslint-disable-next-line no-unused-vars
module.exports = (req, res, next) => {
  const parseForwardedFor = (value) => {
    if (!value) {
      return undefined;
    }

    const commaIndex = value.indexOf(',');
    return commaIndex === -1 ? value : value.substr(0, commaIndex);
  };

  if (req.url !== '/favicon.ico' && req.url !== '/robots.txt') {
    log.warn(`404 (Not found) - ${req.originalUrl} - ${req.method}`
      + ` - ${parseForwardedFor(req.headers['x-forwarded-for']) || req.connection.remoteAddress}`);
  }
  next(); // Pass further, to actually render 404 response
};
