const config = require('../../config');
const log = require('../util').logger;
const express = require('express');
const Raven = require('raven');
const routes = require('./routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();

if (config.sentry.dsn) {
  Raven.config(config.sentry.dsn).install();
}

module.exports = (middlewares = []) => {
  if (config.sentry.dsn) {
    app.use(Raven.requestHandler());
  }

  // TODO move swagger init into special folder
  // - usually its more complicated, than just to include single JSON
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  middlewares.forEach(_ => _(app));

  /**
   * Application routes
   */
  app.get('/health', routes.healthCheckRoute);

  app.use((req, res, next) => {
    if (req.url !== '/favicon.ico' && req.url !== '/robots.txt') {
      log.error(`${404} - ${'Page not found.'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
    next(); // Anyway 404, just lets not spam our error logs by throwing exception
  });

  // Error handling
  if (config.sentry.dsn) {
    app.use(Raven.errorHandler());
  }

  /* eslint-disable no-unused-vars */
  app.use((err, req, res, next) => {
    /* eslint-enable no-unused-vars */
    log.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    let errorObj = null;
    res.status(err.status || 500);
    if (err.stack) {
      errorObj = {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
      };
    } else {
      errorObj = { message: err.message };
    }

    if (errorObj !== null) {
      res.json(errorObj);
    }
  });

  app.listen(config.server.listenOnPort, () => {
    log.info(`App listening on ${config.server.listenOnPort}, pid = ${process.pid}`);
  });
};
