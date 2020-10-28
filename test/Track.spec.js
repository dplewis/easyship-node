const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}track/v1`;

const testData = {
  easyship_shipment_id: 'ESUS10043358',
};
describe('track', () => {
  describe('checkpoints', () => {
    it('Sends the correct request', () => {
      easyship.track.checkpoints(testData);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: `${BASE_PATH}/checkpoints`,
        data: testData,
      });
    });
  });

  describe('status', () => {
    it('Sends the correct request', () => {
      easyship.track.status(testData);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: `${BASE_PATH}/status`,
        data: testData,
      });
    });
  });
});
