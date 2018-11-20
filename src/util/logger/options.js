const path = require('path');
const fs = require('fs');
const config = require('../../../config');

const logDir = path.join(process.cwd(), config.logger.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const options = {
  file: {
    level: config.logger.level.file,
    filename: path.join(logDir, config.logger.fileName),
    handleExceptions: true,
    datePattern: 'YYYY-MM-DD',
    maxSize: '5m',
    maxFiles: '5d',
    colorize: false,
  },
  elastic: {
    level: config.logger.level.elastic,
    messageType: '_doc',
    clientOpts: { host: (config.elastic) ? config.elastic.host : undefined },
    handleExceptions: true,
    colorize: false,
  },
  console: {
    level: config.logger.level.console,
    handleExceptions: true,
    colorize: true,
  },
};

module.exports = options;
