const method = require('../Method');

module.exports = require('../Resource').extend({
  path: '/shipment/v1/shipments',
  operations: ['create', 'del', 'list', 'retrieve', 'update'],
  createLabel: method({
    method: 'POST',
    path: 'create_and_buy_label',
  }),
  updateWarehouse: method({
    method: 'PATCH',
    path: 'update_warehouse_state',
  }),
});
