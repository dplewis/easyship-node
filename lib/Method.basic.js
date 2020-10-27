const Method = require('./Method');

module.exports = {
  create: Method({
    method: 'POST',
  }),

  list: Method({
    method: 'GET',
    path: '',
  }),

  retrieve: Method({
    method: 'GET',
    path: '/{id}',
    urlParams: ['id'],
  }),

  update: Method({
    method: 'PATCH',
    path: '{id}',
    urlParams: ['id'],
  }),

  // Avoid 'delete' keyword in JS
  del: Method({
    method: 'DELETE',
    path: '{id}',
    urlParams: ['id'],
  }),
};
