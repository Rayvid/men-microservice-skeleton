const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

const logDir = path.join(__dirname, process.env.LOG_DIR || 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const options = {
  file: {
    level: process.env.LOG_LEVEL || 'info',
    filename: `${logDir}/${process.env.LOG_FILE_NAME || 'combined.log'}`,
    handleExceptions: true,
    json: true,
    datePattern: 'YYYY-MM-DD-HH',
    maxSize: '5m',
    maxFiles: '5d',
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile(options.file),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false,
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = logger;
