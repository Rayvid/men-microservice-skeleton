import path from 'path';
import fs from 'fs';
import winston from 'winston';
import * as config from '../../../config/index.js';

const logDir = path.join(process.cwd(), config.logger.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const file = {
  level: config.logger.level.file,
  filename: path.join(logDir, config.logger.fileName),
  handleExceptions: true,
  datePattern: 'YYYY-MM-DD',
  maxSize: '5m',
  maxFiles: '5d',
};

export const console = {
  level: config.logger.level.console,
  handleExceptions: true,
  // Specialized formatter for console - for better readability
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf((info) => {
        const {level, timestamp} = info;

        /* eslint-disable no-param-reassign */
        delete info.level;
        delete info.timestamp;
        /* eslint-enable no-param-reassign */

        /* If not string - look for inspect, otherwise just stringify  */
        // eslint-disable-next-line no-nested-ternary, implicit-arrow-linebreak
        return `${timestamp} ${level}: ${(info.message && typeof info.message !== 'string') ?
          // Not sure if it can happen, but handle objects inside message too
          JSON.stringify(info.message).replace(/\\n/g, '\n') :
          !info.message || info.stack ?
            JSON.stringify(info).replace(/\\n/g, '\n') :
            info.message}`;
      }),
  ),
};
