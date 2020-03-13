const Sentry = require('@sentry/node');
const config = require('config');
const joi = require('joi');
const server = require('./schema/server');
const logger = require('./schema/logger');

const sentryConfig = config.get('sentry');
if (sentryConfig.dsn) {
  Sentry.init({ dsn: sentryConfig.dsn });
}

module.exports = {
  db: config.get('db'),
  server: joi.attempt(config.get('server'), server),
  logger: joi.attempt(config.get('logger'), logger),
  sentry: sentryConfig,
  mongo: config.get('db.mongo'),
  oauth2: config.get('oauth2'),
};
