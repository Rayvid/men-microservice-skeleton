// Placeholder for global tests
// it's good idea to have local tests folders inside src to do contextual unittesting
import '../config/env.js'; // Ensure its invoked before everything else, otherwise it becomes sequence dependant
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {oauth2ClientGetAccessToken} from '../src/util/network/index.js';
import {validateAuthHeader} from '../src/web/middlewares/auth.js';
import {UnauthorizedException} from '../src/exceptions/index.js';

chai.use(chaiAsPromised);
chai.should();

describe('Oauth2', () => {
  describe('Get access token', () => {
    it('it should be able to fetch access token from auth0', async () => {
      // hardcoding some credentials generously served by auth0, for test purposes
      // You should always pass those trough environment!
      await (validateAuthHeader(`bearer ${await oauth2ClientGetAccessToken(
          '2isgefBsD9SJ1o7vJZn1x6iC1tmRMwcA',
          'mdNv5pjLD6pFi6HzIDJbt8UgQf0vwCCWvKJ-3BDRdrs7lVI0-hvMWXbTSMtaKJmC',
          'discounts:write.all',
      )}`, 'discounts:write.all'));
    });

    it('it should throw on invalid scope', async () => {
      // hardcoding some credentials generously served by auth0, for test purposes
      // You should always pass those trough environment!
      validateAuthHeader(`bearer ${await oauth2ClientGetAccessToken(
          '2isgefBsD9SJ1o7vJZn1x6iC1tmRMwcA',
          'mdNv5pjLD6pFi6HzIDJbt8UgQf0vwCCWvKJ-3BDRdrs7lVI0-hvMWXbTSMtaKJmC',
          'test',
      )}`, 'tset').should.be.rejectedWith(UnauthorizedException);
    });
  });
});
