import _ from 'underscore';
import {UnauthorizedException} from '../../exceptions/index.js';
import {network, logger as log} from '../../util/index.js';

export const validateAuthHeader = async (authorizationHeader, scope) => {
  if (!authorizationHeader || authorizationHeader.length < 7) {
    throw new UnauthorizedException({
      message: 'Authorization failed',
      description: 'Authorization header too short (not set at all?)',
    });
  }
  if (authorizationHeader.substring(0, 7).toLowerCase() !== 'bearer ') {
    throw new UnauthorizedException({message: 'Authorization failed', description: 'Token is not a bearer'});
  }

  return network.parseAndValidateJwt(authorizationHeader.substring(7), scope);
};

export const validateAuth = async (scope, req, res, next) => {
  if (!req.headers.authorization &&
      process.env.NODE_ENV === 'development' &&
      process.env.DEV_BYPASS_SCOPES &&
      _.intersection(scope.split(' '), process.env.DEV_BYPASS_SCOPES.split(' ')).length > 0) {
    log.warn('Bypassing authorization header check - should not happen on prod!');

    if (process.env.DEV_ENFORCE_TOKEN_PAYLOAD) {
      log.warn('Enforcing token payload - should not happen on prod!');
      res.locals.token = {payload: JSON.parse(process.env.DEV_ENFORCE_TOKEN_PAYLOAD)};
    }

    next();
    return;
  }

  res.locals.token = await validateAuthHeader(req.headers.authorization, scope);
  next();
};
