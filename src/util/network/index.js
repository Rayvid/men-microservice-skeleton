const simpleOauth2 = require('simple-oauth2');
const { oauth2: oauth2Config } = require('../../../config');
const jwt = require('./jwt');

module.exports = {
  parseAndValidateJwt: jwt,
  oauth2ClientGetAccessToken: async (clientId, clientSecret, scopes) => {
    const oauth2 = simpleOauth2.create({
      client: {
        id: clientId,
        secret: clientSecret,
      },
      auth: {
        tokenHost: oauth2Config.tokenHost,
        tokenPath: oauth2Config.tokenPath,
      },
    });

    const tokenConfig = {
      audience: oauth2Config.audience,
      scope: scopes,
    };

    return (await oauth2.clientCredentials.getToken(tokenConfig)).access_token;
  },
};
