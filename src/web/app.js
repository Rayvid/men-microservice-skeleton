const config = require('../../config');
const express = require('express');

const morgan = require('morgan');
const log = require('../util').logger;

const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./swagger.json');

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(morgan('combined', { stream: log.stream }));

app.get('/', (req, res) => {
  log.debug('Debug statement');
  res.json({ message: 'Hello World!' });
});

app.use((req, res) => {
  log.error(`${404} - ${'Page not found.'} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(404).json({ message: 'Page not found.' });
});

app.use((err, req, res) => {
  log.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(config.server.listenOnPort, () => {
  log.info(`App listening on ${config.server.listenOnPort}, pid = ${process.pid}`);
});
