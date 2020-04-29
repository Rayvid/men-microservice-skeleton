const _ = require('underscore');
const { UnauthorizedException } = require('../../exceptions');
const { parseAndValidateJwt } = require('../../util/network');
const { logger: log } = require('../../util');

async function validateAuthHeader(authorizationHeader, scope) {
  if (!authorizationHeader || authorizationHeader.length < 7) {
    throw new UnauthorizedException({ message: 'Authorization failed', description: 'Authorization header too short (not set at all?)' });
  }
  if (authorizationHeader.substring(0, 7).toLowerCase() !== 'bearer ') {
    throw new UnauthorizedException({ message: 'Authorization failed', description: 'Token is not bearer' });
  }

  const tokenRaw = authorizationHeader.substring(7);

  return parseAndValidateJwt(tokenRaw, scope);
}

const validateAuth = async (scope, req, res, next) => {
  if (!req.headers.authorization
    && process.env.NODE_ENV === 'development'
    && process.env.DEV_BYPASS_SCOPES && _.intersection(scope.split(' '), process.env.DEV_BYPASS_SCOPES.split(' ')).length > 0) {
    log.warn('Bypassing authorization header check - should not happen on prod!');

    if (process.env.DEV_ENFORCE_TOKEN_PAYLOAD) {
      log.warn('Enforcing token payload - should not happen on prod!');
      res.locals.token = { payload: JSON.parse(process.env.DEV_ENFORCE_TOKEN_PAYLOAD) };
    }

    next();
    return;
  }

  res.locals.token = await validateAuthHeader(req.headers.authorization, scope);
  next();
};

module.exports = {
  validateAuth,
  validateAuthHeader,
};
