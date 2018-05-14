const express = require('express');

require('dotenv').config();
const config = require('config');

const morgan = require('morgan');
const logger = require('./logger');

const swaggerUi = require('swagger-ui-express');
const swaggerIndexJson = require('./swagger/index.json');

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerIndexJson));

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

app.listen(config.get('listen_on_port'), () => {
  logger.info(`App listening on ${config.get('listen_on_port')}`);
});
