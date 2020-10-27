const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}rate/v1/rates`;

describe('Rate Resource', () => {
  describe('create', () => {
    it('Sends the correct request', () => {
      easyship.rate.create();
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: BASE_PATH,
        data: {},
      });
    });
  });
});
