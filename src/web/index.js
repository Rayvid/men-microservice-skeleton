// This file is all about defining and running http server instance
// Some infrastructure code leak there is ok, just try to keep it at minimum
import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';

import * as middlewares from './middlewares/index.js';
import * as config from '../../config/index.js';
import {logger as log} from '../util/index.js';
import routes from './routes/index.js';

import path from 'path';
import fs from 'fs';

const swaggerDoc = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/web/swagger.json')));

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
