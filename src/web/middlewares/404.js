import {logger as log} from '../../util/index.js';

// eslint-disable-next-line no-unused-vars
export default async (req, res, next) => {
  const parseForwardedFor = (value) => {
    if (!value) {
      return undefined;
    }

    const commaIndex = value.indexOf(',');
    return commaIndex === -1 ? value : value.substr(0, commaIndex);
  };

  log.warn(`404 (Not found) - ${req.originalUrl} - ${req.method}` +
      ` - ${parseForwardedFor(req.headers['x-forwarded-for']) || req.connection.remoteAddress}`);
  next(); // Pass further, to actually render 404 response
};
