const winston = require('winston');
const ElasticSearch = require('winston-elasticsearch');
const defaultOptions = require('./options');
require('winston-daily-rotate-file');

const init = (options = defaultOptions) => {
  const transports = [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ];
  if (options.elastic.clientOpts.host) {
    transports.push(new ElasticSearch(options.elastic));
  }
  const logger = new winston.Logger({
    transports,
    exitOnError: false,
  });

  logger.stream = {
    write: (message) => {
      logger.info(message);
    },
  };

  return logger;
};

module.exports = options => init(options);
