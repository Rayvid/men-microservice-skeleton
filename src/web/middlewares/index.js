const Sentry = require('@sentry/node');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const config = require('../../../config');
const { logger: log } = require('../../util');
const modelInitializer = require('./modelInitializer');
const errorHandler = require('./error.js');
const notFoundHandler = require('./404.js');

module.exports = {
  // Those trigger before handler
  beforeHandler: [
    (app) => {
      if (config.sentry.dsn) {
        app.use(Sentry.Handlers.requestHandler());
      }
    },
    (app) => app.use(expressWinston.logger(log)),
    (app) => app.use(bodyParser.json({ limit: '10mb' })),
    modelInitializer],
  // Those trigger if error or not found (depends on function signature)
  afterHandler: [
    (app) => app.use(notFoundHandler),
    (app) => {
      if (config.sentry.dsn) {
        app.use(Sentry.Handlers.errorHandler());
      }
    },
    (app) => app.use(errorHandler),
  ],
};
