// Placeholder for global tests
// it's good idea to have local tests folders inside src to do contextual unittesting
require('../config/env'); // Ensure its invoked before everything else, otherwise it becomes sequence dependant
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { oauth2ClientGetAccessToken } = require('../src/util/network');
const { validateAuthHeader } = require('../src/web/middlewares/auth');
const { UnauthorizedException } = require('../src/exceptions');

chai.use(chaiAsPromised);
chai.should();

describe('Oauth2', () => {
  describe('Get access token', () => {
    it('it should be able to fetch access token from auth0', async () => {
      // hardcoding some credentials generously served by auth0, for test purposes
      // You should always pass those trough environment!
      await (validateAuthHeader('bearer ' + await oauth2ClientGetAccessToken(
        '2isgefBsD9SJ1o7vJZn1x6iC1tmRMwcA',
        'mdNv5pjLD6pFi6HzIDJbt8UgQf0vwCCWvKJ-3BDRdrs7lVI0-hvMWXbTSMtaKJmC',
        'test',
      ), 'test'));
    });

    it('it should throw on invalid scope', async () => {
      // hardcoding some credentials generously served by auth0, for test purposes
      // You should always pass those trough environment!
      validateAuthHeader('bearer ' + await oauth2ClientGetAccessToken(
        '2isgefBsD9SJ1o7vJZn1x6iC1tmRMwcA',
        'mdNv5pjLD6pFi6HzIDJbt8UgQf0vwCCWvKJ-3BDRdrs7lVI0-hvMWXbTSMtaKJmC',
        'test',
      ), 'tset').should.be.rejectedWith(UnauthorizedException);
    });
  });
});
