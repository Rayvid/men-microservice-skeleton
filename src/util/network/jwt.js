const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const { UnauthorizedException } = require('../../exceptions');
const config = require('../../../config');

const client = jwksClient({
  cache: true,
  jwksUri: config.oauth2.jwksURI,
});

const readIdentityServerPubKey = async (header) => {
  let resolveHook;
  let rejectHook;
  const promise = new Promise((resolve, reject) => {
    resolveHook = resolve;
    rejectHook = reject;
  });

  if (!header.kid) {
    rejectHook(new Error('No kid in header'));
  }

  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      rejectHook(err);
    } else {
      resolveHook(key.publicKey || key.rsaPublicKey);
    }
  });

  return promise;
};

module.exports = async (tokenRaw, scope) => {
  const token = jwt.decode(tokenRaw, { complete: true });
  token.raw = tokenRaw;

  // We expect token.header, token.payload and token.raw to be filled after this point
  try {
    const publicKey = await readIdentityServerPubKey(token.header);
    let resolveHook;
    let rejectHook;
    const promise = new Promise((resolve, reject) => {
      resolveHook = resolve;
      rejectHook = reject;
    });
    jwt.verify(
      token.raw,
      publicKey,
      { ignoreExpiration: false, ignoreNotBefore: false },
      (err, decoded) => {
        if (err) {
          rejectHook(err);
        } else {
          resolveHook(decoded);
        }
      },
    );

    await promise;

    if (scope && (!token.payload.scope || !token.payload.scope.split(' ').includes(scope))) {
      throw new UnauthorizedException({ message: `No access to scope - '${scope}'` });
    }

    return token;
  } catch (err) {
    throw new UnauthorizedException({
      message: 'Requests authorization header validation attempt failed',
      innerError: err,
    });
  }
};
