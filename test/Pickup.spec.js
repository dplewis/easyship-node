const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}pickup/v1`;

describe('pickup', () => {
  describe('create', () => {
    it('Sends the correct request', () => {
      const data = {
        courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
        preferred_date: '2021-12-08',
        preferred_max_time: '2021-12-08T18:00',
        preferred_min_time: '2021-12-08T09:00',
        easyship_shipment_ids: [
          'ESUS10043358',
        ],
      };
      easyship.pickup.create(data);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: `${BASE_PATH}/pickups`,
        data,
      });
    });
  });

  describe('directHandover', () => {
    it('Sends the correct request', () => {
      easyship.pickup.directHandover({
        easyship_shipment_ids: ['ESUS10043358'],
      });
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: `${BASE_PATH}/direct_handover`,
        data: {
          easyship_shipment_ids: ['ESUS10043358'],
        },
      });
    });
  });

  describe('retrieve', () => {
    it('Sends the correct request', () => {
      easyship.pickup.retrieve('12345');
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: `${BASE_PATH}/pickup_slots/12345`,
        data: {},
      });
    });
  });
});
