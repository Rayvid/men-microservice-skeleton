const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const defaultOptions = require('./options');

const init = (options = defaultOptions) => {
  const transports = [
    new DailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ];
  // TODO remove elastic everywhere, that should be graylog or ELK, no direct elastic calls
  // if (options.elastic.clientOpts.host) {
  // transports.push(new ElasticSearch(options.elastic));
  // }
  const logger = winston.createLogger({
    transports,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf((info) =>
        /* If not string - look for inspect, otherwise just stringify  */
        // eslint-disable-next-line no-nested-ternary, implicit-arrow-linebreak
        `${info.imestamp} ${info.level}: ${(info.message && typeof info.message !== 'string')
          // Not sure if it can happen, but handle objects inside message too
          ? JSON.stringify(info.message)
          : !info.message || info.stack
            ? JSON.stringify(info)
            : info.message}`), // Thats string after all
    ),
    exitOnError: false, // Logger should't decide about to exit or not
  });

  return logger;
};

module.exports = (options) => init(options);
