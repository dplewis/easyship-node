const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}reference/v1/categories`;

describe('categories', () => {
  describe('list', () => {
    it('Sends the correct request', () => {
      easyship.categories.list();
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: BASE_PATH,
        data: {},
      });
    });
  });
});
