import Sentry from '@sentry/node';
import config from 'config';
import joi from 'joi';
import serverSchema from './schema/server.js';
import loggerSchema from './schema/logger.js';

const sentryConfig = config.get('sentry');
if (sentryConfig.dsn) {
  Sentry.init({dsn: sentryConfig.dsn});
}

export const db = config.get('db');
export const server = joi.attempt(config.get('server'), serverSchema);
export const logger = joi.attempt(config.get('logger'), loggerSchema);
export const sentry = sentryConfig;
export const mongo = config.get('db.mongo');
export const oauth2 = config.get('oauth2');

export const wallets = config.get('wallets');