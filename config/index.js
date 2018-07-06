require('./env');

const config = require('config');
const joi = require('joi');
const server = require('./schema/server');
const elastic = require('./schema/elastic');
const logger = require('./schema/logger');

module.exports = {
  db: config.get('db'),
  server: joi.attempt(config.get('server'), server),
  elastic: joi.attempt(config.get('elastic'), elastic),
  logger: joi.attempt(config.get('logger'), logger),
};
