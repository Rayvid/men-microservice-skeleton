const logger = require('./logger')();

const parseForwardedFor = (value) => {
  if (!value) {
    return undefined;
  }

  const commaIndex = value.indexOf(',');
  return commaIndex === -1 ? value : value.substr(0, commaIndex);
};

module.exports = {
  logger,
  parseForwardedFor,
};
