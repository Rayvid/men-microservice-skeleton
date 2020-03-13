// This file is all about defining and running http server instance
// Some infrastructure code leak there is ok, just try to keep it minimum
const express = require('express');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
const middlewares = require('./middlewares');
require('express-async-errors');

const config = require('../../config');
const { logger: log } = require('../util');
const routes = require('./routes');
const swaggerDoc = require('./swagger.json');

const app = express();

middlewares.beforeHandler.forEach((_) => _(app));

// TODO move swagger init into special folder and make it environment aware (dynamic)
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Application routes, for simple microservices just plainly listing it in one place is fine
app.get('/health', routes.healthCheckRoutes.healthCheck);
app.get('/health/sentry', routes.healthCheckRoutes.sentryPing);
app.get('/version', routes.versionCheck);

middlewares.afterHandler.forEach((_) => _(app));

app.listen(config.server.listenOnPort, () => {
  log.info(`App listening on ${config.server.listenOnPort}, pid = ${process.pid}`);
});
