const Sentry = require('@sentry/node');
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const config = require('../../../config');
const { logger: log } = require('../../util');
const modelInitializer = require('./modelInitializer');
const errorHandler = require('./error.js');
const notFoundHandler = require('./404.js');
const authHandler = require('./auth.js');

module.exports = {
  validateAuth: authHandler.validateAuth.bind(null, undefined),
  validateAuthScope: (scope) => authHandler.validateAuth.bind(null, scope),
  // Those trigger before handler
  beforeHandler: [
    (app) => {
      app.use((req, res, next) => {
        // Shortcut for common scenarious to not consume cycles and not spam log
        if (req.method == 'OPTIONS') {
          res.send(200);
        } else if (req.url === '/favicon.ico' || req.url === '/robots.txt') {
          res.send(404);
        } else {
          next();
        }
      });
    },
    (app) => {
      if (config.sentry.dsn) {
        app.use(Sentry.Handlers.requestHandler());
      }
    },
    (app) => app.use(expressWinston.logger(log)),
    (app) => app.use(bodyParser.json({ limit: '10mb' })),
    modelInitializer],
  // Those trigger after handler, usually if error or not found (depends on function signature)
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
