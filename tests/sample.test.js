// Placeholder for global tests
// it's a good idea to have local tests folders inside src to do contextual unittesting
import '../config/env.js'; // Ensure its invoked before everything else, otherwise it becomes sequence dependant
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      [1, 2, 3].indexOf(5).should.equal(-1);
      [1, 2, 3].indexOf(0).should.equal(-1);
    });
  });
});
