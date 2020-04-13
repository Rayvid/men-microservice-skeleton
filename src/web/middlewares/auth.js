const { UnauthorizedException } = require('../../exceptions');
const { parseAndValidateJwt } = require('../../util/network');

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

const validateAuth = async (scope, req, res) => {
  res.locals.token = await validateAuthHeader(req.headers.authorization, scope);
};

module.exports = {
  validateAuth,
  validateAuthHeader,
};
