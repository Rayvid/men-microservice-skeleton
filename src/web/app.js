const config = require('../../config');
const express = require('express');

const morgan = require('morgan');
const logger = require('../util/logger');

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(morgan('combined', { stream: logger.stream }));

app.get('/', (req, res) => {
  logger.debug('Debug statement');
  res.json({ message: 'Hello World!' });
});

app.use((req, res) => {
  logger.error(`${404} - ${'Page not found.'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(404).json({ message: 'Page not found.' });
});

app.use((err, req, res) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(config.server.port, () => {
  logger.info(`App listening on ${config.server.port}, pid = ${process.pid}`);
});
