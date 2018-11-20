const winston = require('winston');
const defaultOptions = require('./options');
require('winston-daily-rotate-file');

const init = (options = defaultOptions) => {
  const transports = [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ];
  // seems deprecated forever
  // if (options.elastic.clientOpts.host) {
  // transports.push(new ElasticSearch(options.elastic));
  // }
  const logger = winston.createLogger({
    transports,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(info =>
        // eslint-disable-next-line no-nested-ternary
        `${info.timestamp} ${info.level}: ${typeof info.message !== 'string'
          ? info.message.inspect
            ? info.message.inspect()
            : JSON.stringify(info.message)
          // eslint-disable-next-line no-nested-ternary
          : info.stack || info.fields
            ? info.inspect
              ? info.inspect()
              : JSON.stringify(info)
            : info.message}`),
    ),
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
