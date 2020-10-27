const method = require('../Method');

module.exports = require('../Resource').extend({
  path: '/pickup/v1',
  operations: [],
  create: method({
    method: 'POST',
    path: 'pickups',
  }),
  directHandover: method({
    method: 'POST',
    path: 'direct_handover',
  }),
  retrieve: method({
    method: 'GET',
    path: 'pickup_slots/{courier_id}',
    urlParams: ['courier_id'],
  }),
});
