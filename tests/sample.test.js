// Placeholder for global tests
// it's good idea to have local tests folders inside src to do contextual unittesting
require('../config/env'); // Ensure its invoked before everything else, otherwise it becomes sequence dependant
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
require('chai').should();

chai.use(chaiAsPromised);

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      [1, 2, 3].indexOf(5).should.equal(-1);
      [1, 2, 3].indexOf(0).should.equal(-1);
    });
  });
});
