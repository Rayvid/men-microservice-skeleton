const config = require('../../config');
const express = require('express');

const morgan = require('morgan');
const log = require('../util').logger;

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();

module.exports = (middlewares = []) => {
  middlewares.forEach(_ => _(app));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  app.use(morgan('combined', { stream: log.stream }));

  app.get('/', (req, res) => {
    log.debug('Debug statement');
    res.json({ message: `${Object.keys(res.locals.getModels()).length} models found in Users database` });
  });

  app.use((req, res, next) => {
    if (req.url !== '/favicon.ico' && req.url !== '/robots.txt') {
      log.error(`${404} - ${'Page not found.'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
    next(); // Anyway 404, just will not spam our error logs
  });

  app.use((err, req, res) => {
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
