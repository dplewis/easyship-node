const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship();

const BASE_PATH = `${easyship.get('basePath')}shipment/v1/shipments`;

describe('shipment', () => {
  describe('create', () => {
    it('Sends the correct request', () => {
      easyship.shipment.create();
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: `${BASE_PATH}`,
        data: {},
      });
    });

    it('Sends the parameters', () => {
      const data = {
        platform_name: 'Amazon',
        platform_order_number: '#1234',
        selected_courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
        destination_country_alpha2: 'US',
        destination_city: 'New York',
        destination_postal_code: '10022',
        destination_state: 'NY',
        destination_name: 'Aloha Chen',
        destination_company_name: 'My Company',
        destination_address_line_1: '300 Park Avenue',
        destination_address_line_2: null,
        destination_phone_number: '+1 234-567-890',
        destination_email_address: 'api-support@easyship.com',
        items: [{
          description: 'Silk dress',
          sku: 'test',
          actual_weight: 1.2,
          height: 10,
          width: 15,
          length: 20,
          category: 'mobiles',
          declared_currency: 'SGD',
          declared_customs_value: 100,
        }],
      };
      easyship.shipment.create(data);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: `${BASE_PATH}`,
        data,
      });
    });
  });

  describe('createLabel', () => {
    it('Can create label', () => {
      const data = {
        platform_name: 'Amazon',
        platform_order_number: '#1234',
        selected_courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
        destination_country_alpha2: 'US',
        destination_city: 'New York',
        destination_postal_code: '10022',
        destination_state: 'NY',
        destination_name: 'Aloha Chen',
        destination_company_name: 'My Company',
        destination_address_line_1: '300 Park Avenue',
        destination_address_line_2: null,
        destination_phone_number: '+1 234-567-890',
        destination_email_address: 'api-support@easyship.com',
        items: [{
          description: 'Silk dress',
          sku: 'test',
          actual_weight: 1.2,
          height: 10,
          width: 15,
          length: 20,
          category: 'mobiles',
          declared_currency: 'SGD',
          declared_customs_value: 100,
        }],
      };
      easyship.shipment.createLabel(data);
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'POST',
        url: `${BASE_PATH}/create_and_buy_label`,
        data,
      });
    });
  });

  describe('del', () => {
    it('Sends the correct request', () => {
      easyship.shipment.del('foobaz');
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'DELETE',
        url: `${BASE_PATH}/foobaz`,
        data: {},
      });
    });
  });

  describe('list', () => {
    it('Sends the correct request', () => {
      easyship.shipment.list({
        easyship_shipment_id: 'ESUS10043350',
      });
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: `${BASE_PATH}`,
        data: {
          easyship_shipment_id: 'ESUS10043350',
        },
      });
    });
  });

  describe('retrieve', () => {
    it('Sends the correct request', () => {
      easyship.shipment.retrieve('12345');
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'GET',
        url: `${BASE_PATH}/12345`,
        data: {},
      });
    });
  });

  describe('update', () => {
    it('Sends the correct request', () => {
      easyship.shipment.update('foobar', {
        destination_name: 'Node',
      });
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'PATCH',
        url: `${BASE_PATH}/foobar`,
        data: {
          destination_name: 'Node',
        },
      });
    });
  });

  describe('updateWarehouse', () => {
    it('Sends the correct request', () => {
      easyship.shipment.updateWarehouse({
        easyship_shipment_ids: ['ESUS10043354'],
      });
      expect(easyship.LAST_REQUEST).to.deep.equal({
        method: 'PATCH',
        url: `${BASE_PATH}/update_warehouse_state`,
        data: {
          easyship_shipment_ids: ['ESUS10043354'],
        },
      });
    });
  });
});
