const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}rate/v1/rates`;

describe('rate', () => {
  describe('create', () => {
    it('Sends the correct request', () => {
      easyship.rate.create();
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: BASE_PATH,
        data: {},
      });
    });

    it('Sends with parameters', () => {
      const data = {
        origin_postal_code: '60605',
        destination_country_alpha2: 'US',
        destination_postal_code: '60605',
        taxes_duties_paid_by: 'Sender',
        is_insured: false,
        apply_shipping_rules: true,
        items: [{
          actual_weight: 1.2,
          height: 10,
          width: 15,
          length: 20,
          category: 'mobiles',
          declared_currency: 'SGD',
          declared_customs_value: 100,
        }],
      };
      easyship.rate.create(data);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: BASE_PATH,
        data,
      });
    });
  });
});
