//  const easyship = require('easyship')('<API KEY>');
const easyship = require('./lib/easyship.js')('');

// POST /rate/v1/rates
easyship.rate.create({
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
}).then(({ rates }) => {
  console.log(rates);
}).catch((e) => {
  console.log(e);
});

// POST /shipment/v1/shipments
// easyship.shipment.create({
//   platform_name: 'Amazon',
//   platform_order_number: '#1234',
//   selected_courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
//   destination_country_alpha2: 'US',
//   destination_city: 'New York',
//   destination_postal_code: '10022',
//   destination_state: 'NY',
//   destination_name: 'Aloha Chen',
//   destination_company_name: 'My Company',
//   destination_address_line_1: '300 Park Avenue',
//   destination_address_line_2: null,
//   destination_phone_number: '+1 234-567-890',
//   destination_email_address: 'api-support@easyship.com',
//   items: [{
//     description: 'Silk dress',
//     sku: 'test',
//     actual_weight: 1.2,
//     height: 10,
//     width: 15,
//     length: 20,
//     category: 'mobiles',
//     declared_currency: 'SGD',
//     declared_customs_value: 100,
//   }],
// }).then(({ shipment }) => {
//   console.log(shipment);
//   console.log(shipment.easyship_shipment_id);
// }).catch((e) => {
//   console.log(e);
// });

// POST /shipment/v1/shipments/create_and_buy_label
// easyship.shipment.createLabel({
//   platform_name: 'Amazon',
//   platform_order_number: '#1234',
//   selected_courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
//   destination_country_alpha2: 'US',
//   destination_city: 'New York',
//   destination_postal_code: '10022',
//   destination_state: 'NY',
//   destination_name: 'Aloha Chen',
//   destination_company_name: 'My Company',
//   destination_address_line_1: '300 Park Avenue',
//   destination_address_line_2: null,
//   destination_phone_number: '+1 234-567-890',
//   destination_email_address: 'api-support@easyship.com',
//   items: [{
//     description: 'Silk dress',
//     sku: 'test',
//     actual_weight: 1.2,
//     height: 10,
//     width: 15,
//     length: 20,
//     category: 'mobiles',
//     declared_currency: 'SGD',
//     declared_customs_value: 100,
//   }],
// }).then(({ shipment }) => {
//   console.log(shipment);
//   console.log(shipment.easyship_shipment_id);
// }).catch((e) => {
//   console.log(e);
// });

// PATCH /shipment/v1/shipments/{easyship_shipment_id}
// easyship.shipment.update('ESUS10043353', {
//   destination_name: 'Node',
// }).then(({ shipment }) => {
//   console.log(shipment);
// }).catch((e) => {
//   console.log(e);
// });

// GET /shipment/v1/shipments/{easyship_shipment_id}
// easyship.shipment.retrieve('ESUS10043348').then(({ shipment }) => {
//   console.log('shipment');
//   console.log(shipment);
// }).catch((e) => {
//   console.log(e);
// });

// GET /shipment/v1/shipments
// easyship.shipment.list({
//   easyship_shipment_id: 'ESUS10043350',
// }).then(({ shipments, total_pages, current_page }) => {
//   console.log(total_pages, current_page, shipments);
// }).catch((e) => {
//   console.log(e);
// });

// DELETE /shipment/v1/shipments/{easyship_shipment_id}
// easyship.shipment.del('ESUS10043351').then((response) => {
//   console.log(response.message);
// }).catch((e) => {
//   console.log(e);
// });

// PATCH /shipment/v1/shipments/update_warehouse_state
// easyship.shipment.updateWarehouse({
//   easyship_shipment_ids: ['ESUS10043354'],
//   warehouse_state: 'packed',
// }).then((response) => {
//   console.log(response.message);
// }).catch((e) => {
//   console.log(e);
// });

// POST /label/v1/labels
// easyship.label.create({
//   shipments: [{ easyship_shipment_id: 'ESUS10043358' }],
// }).then((response) => {
//   console.log(response);
// }).catch((e) => {
//   console.log(e);
// });

// GET /pickup/v1/pickup_slots/{courier_id}
// easyship.pickup.retrieve('b6f1d8c1-7e1e-465e-aa64-880d34662e54').then(({ pickup }) => {
//   console.log(pickup);
// }).catch((e) => {
//   console.log(e);
// });

// POST /pickup/v1/pickups
// easyship.pickup.create({
//   courier_id: 'b6f1d8c1-7e1e-465e-aa64-880d34662e54',
//   preferred_date: '2021-12-08',
//   preferred_max_time: '2021-12-08T18:00',
//   preferred_min_time: '2021-12-08T09:00',
//   easyship_shipment_ids: [
//     'ESUS10043358',
//   ],
// }).then((response) => {
//   console.log(response);
// }).catch((e) => {
//   console.log(e);
// });

// POST /pickup/v1/pickups
// easyship.pickup.directHandover({
//   easyship_shipment_ids: [
//     'ESUS10043358',
//   ],
// }).then((response) => {
//   console.log(response);
// }).catch((e) => {
//   console.log(e);
// });

// GET /track/v1/status
// easyship.track.status({
//   easyship_shipment_id: 'ESUS10043358',
// }).then((response) => {
//   console.log(response);
// }).catch((e) => {
//   console.log(e);
// });

// GET /track/v1/checkpoints
// easyship.track.checkpoints({
//   easyship_shipment_id: 'ESUS10043358',
// }).then((response) => {
//   console.log(response);
// }).catch((e) => {
//   console.log(e);
// });

// GET /reference/v1/categories
// easyship.categories.list().then(({ categories }) => {
//   console.log(categories);
// }).catch((e) => {
//   console.log(e);
// });
