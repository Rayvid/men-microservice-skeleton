import {ClientCredentials} from 'simple-oauth2';
import {oauth2 as oauth2Config} from '../../../config/index.js';
import jwt from './jwt.js';

export const parseAndValidateJwt = jwt;
export const oauth2ClientGetAccessToken = async (clientId, clientSecret, scopes) => {
  const oauth2 = new ClientCredentials({
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

  return (await oauth2.getToken(tokenConfig)).token.access_token;
};
