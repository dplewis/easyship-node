const method = require('../Method');
module.exports = require('../Resource').extend({
  path: 'track/v1',
  operations: [],
  checkpoints: method({
    method: 'GET',
    path: 'checkpoints',
  }),
  status: method({
    method: 'GET',
    path: 'status',
  }),
});
