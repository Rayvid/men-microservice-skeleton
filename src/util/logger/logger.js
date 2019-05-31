const pino = require('pino');
const path = require('path');
const fs = require('fs');
const config = require('../../../config');
const defaultOptions = require('./options');

const logDir = path.join(process.cwd(), config.logger.dir);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const init = (options = defaultOptions) => {

  const logger = pino(options, pino.destination(path.join(logDir, "combined.log")));

  return logger;
};

module.exports = options => init(options);
