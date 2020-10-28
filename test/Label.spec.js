const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}label/v1/labels`;

describe('label', () => {
  describe('create', () => {
    it('Sends the correct request', () => {
      easyship.label.create({
        shipments: [{ easyship_shipment_id: 'ESUS10043358' }],
      });
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: BASE_PATH,
        data: {
          shipments: [{ easyship_shipment_id: 'ESUS10043358' }],
        },
      });
    });
  });
});
