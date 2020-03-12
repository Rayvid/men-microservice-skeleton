const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const { logger: log } = require('../../util');
const modelInitializer = require('./modelInitializer');
const errorHandler = require('./error.js');
const notFoundHandler = require('./404.js');

module.exports = {
  beforeHandler: [
    (app) => app.use(expressWinston.logger(log)),
    (app) => app.use(bodyParser.json({ limit: '10mb' })),
    modelInitializer],
  notFound: notFoundHandler,
  errorSink: errorHandler,
};
