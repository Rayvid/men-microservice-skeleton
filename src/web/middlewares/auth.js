const { UnauthorizedException } = require('../../exceptions');
const { parseAndValidateJwt } = require('../../util/network');
const { logger: log } = require('../../util');

async function validateAuthHeader(authorizationHeader, scope) {
  if (!authorizationHeader || authorizationHeader.length < 7) {
    throw new UnauthorizedException({ message: 'Authorization header too short (not set at all?)' });
  }
  if (authorizationHeader.substring(0, 7).toLowerCase() !== 'bearer ') {
    throw new UnauthorizedException({ message: 'Token is not bearer' });
  }

  const tokenRaw = authorizationHeader.substring(7);

  return parseAndValidateJwt(tokenRaw, scope);
}

const validateAuth = async (scope, req, res, next) => {
  if (process.env.NODE_ENV === 'development' && process.env.DEV_BYPASS_SCOPES && process.env.DEV_BYPASS_SCOPES.split(' ').includes(scope)) {
    log.warn('Bypassing authorization header check - should not happen on prod!');
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
