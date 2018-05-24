const winston = require('winston');
const ElasticSearch = require('winston-elasticsearch');
const path = require('path');
const fs = require('fs');
const config = require('../../../config');
require('winston-daily-rotate-file');

const logDir = path.join(__dirname, config.logger.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const options = {
  file: {
    level: config.logger.level.file,
    filename: `${logDir}/${config.logger.fileName}`,
    handleExceptions: true,
    json: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m',
    maxFiles: '5d',
    colorize: false,
  },
  elastic: {
    level: config.logger.level.elastic,
    messageType: '_doc',
    clientOpts: { host: config.elastic.host },
    handleExceptions: true,
    json: true,
    colorize: false,
  },
  console: {
    level: config.logger.level.console,
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const transports = [
  new winston.transports.DailyRotateFile(options.file),
  new winston.transports.Console(options.console),
];
if (config.elastic.host) {
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

module.exports = logger;
