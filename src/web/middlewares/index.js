import Sentry from '@sentry/node';
import express from 'express';
import expressWinston from 'express-winston';
import * as config from '../../../config/index.js';
import {logger as log} from '../../util/index.js';
import modelInitializer from './modelInitializer.js';
import errorHandler from './error.js';
import notFoundHandler from './404.js';
import * as authHandler from './auth.js';

export const validateAuth = authHandler.validateAuth.bind(null, undefined);
export const validateAuthScope = (scope) => authHandler.validateAuth.bind(null, scope);

// Those trigger before every handler
export const beforeHandler = [
  (app) => {
    app.use((req, res, next) => {
      // Shortcut for common scenarious to not consume cycles and not spam log
      if (req.method === 'OPTIONS') {
        res.sendStatus(204);
      } else if (req.url === '/favicon.ico' || req.url === '/robots.txt') {
        res.sendStatus(404);
      } else {
        next();
      }
    });
  },
  (app) => {
    if (config.sentry.dsn) {
      app.use(Sentry.Handlers.requestHandler());
    }
  },
  (app) => app.use(expressWinston.logger(log)),
  (app) => app.use(express.json({limit: '10mb'})),
  modelInitializer,
];

// Those trigger after after unhandled
export const afterHandler = [
  (app) => app.use(notFoundHandler),
  (app) => {
    if (config.sentry.dsn) {
      app.use(Sentry.Handlers.errorHandler());
    }
  },
  (app) => app.use(errorHandler),
];

