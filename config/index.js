const config = require('config');
const joi = require('joi');
const api = require('./schema/api');
const db = require('./schema/db');
const server = require('./schema/server');
const elastic = require('./schema/elastic');
const logger = require('./schema/logger');

module.exports = {
  api: joi.attempt(config.get('api'), api),
  db: joi.attempt(config.get('db'), db),
  server: joi.attempt(config.get('server'), server),
  elastic: joi.attempt(config.get('elastic'), elastic),
  logger: joi.attempt(config.get('logger'), logger),
};
