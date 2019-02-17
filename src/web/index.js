// This file is all about defining and running http server instance
// Some infrastructure code leak there is ok, just try to keep it minimum
const Sentry = require('@sentry/node');
const middlewares = require('./middlewares');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
require('express-async-errors');

const config = require('../../config');
const log = require('../util').logger;
const routes = require('./routes');
const swaggerDoc = require('./swagger.json');

const app = express();

if (config.sentry.dsn) {
  Sentry.init({ dsn: config.sentry.dsn });
}

if (config.sentry.dsn) {
  app.use(Sentry.Handlers.requestHandler());
}

// TODO move swagger init into special folder
// - usually its more complicated, than just to include single JSON
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
middlewares.beforeHandler.forEach(_ => _(app));

// Application routes
app.get('/health', routes.healthCheck);
app.get('/health/sentry', routes.sentryPing);
app.get('/version', routes.versionCheck);

app.use((req, res, next) => {
  if (req.url !== '/favicon.ico' && req.url !== '/robots.txt') {
    log.error(`${404} - ${'Page not found.'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  next(); // Anyway 404, just lets not spam our error logs by throwing exception
});

// Error handling
if (config.sentry.dsn) {
  app.use(Sentry.Handlers.errorHandler());
}
app.use(middlewares.errorSink);

app.listen(config.server.listenOnPort, () => {
  log.info(`App listening on ${config.server.listenOnPort}, pid = ${process.pid}`);
});
