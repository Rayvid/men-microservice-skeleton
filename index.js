const express = require('express');

require('dotenv').config();
const config = require('config');

const morgan = require('morgan');
const logger = require('./logger');

const swaggerUi = require('swagger-ui-express');
const swaggerIndexJson = require('./swagger/index.json');

const app = express();

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerIndexJson));

app.use(morgan('dev', {
  skip: (req, res) => res.statusCode < 400,
  stream: process.stderr,
}));

app.use(morgan('dev', {
  skip: (req, res) => res.statusCode >= 400,
  stream: process.stdout,
}));

app.get('/', (req, res) => {
  logger.debug('Debug statement');
  res.json({ message: 'Hello World!' });
});

app.use((req, res) => {
  logger.error('Page not found.');
  res.status(404).json({ message: 'Page not found.' });
});

app.use((error, req, res) => {
  logger.error(error);
  res.status(500).json({ message: 'Internal Server Error.' });
});

app.listen(config.get('listen_on_port'), () => {
  logger.info(`App listening on ${config.get('listen_on_port')}`);
});
