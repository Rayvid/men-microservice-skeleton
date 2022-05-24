import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as defaultOptions from './options.js';

export default (options = defaultOptions) => {
  const transports = [
    new winston.transports.Console(options.console),
  ];
  if (options.file) {
    transports.push(new DailyRotateFile(options.file));
  }
  const logger = winston.createLogger({
    transports,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info) =>
          /* If not string - look for inspect, otherwise just stringify  */
          // eslint-disable-next-line no-nested-ternary, implicit-arrow-linebreak
          `${info.imestamp} ${info.level}: ${(info.message && typeof info.message !== 'string') ?
              // Not sure if it can happen, but handle objects inside message too
              JSON.stringify(info.message) :
              !info.message || info.stack ?
                  JSON.stringify(info) :
                  info.message}`),
    ),
    exitOnError: false, // Logger should't decide about to exit or not
  });

  return logger;
};
