const utils = require('./utils');

/**
 * Create an API method from the declared spec.
 *
 * @param [spec.method='GET'] Request Method (POST, GET, DELETE, PUT)
 * @param [spec.path=''] Path to be appended to the API BASE_PATH, joined with
 *  the instance's path (e.g. "addresses" or "shipments")
 * @param [spec.required=[]] Array of required arguments in the order that they
 *  must be passed by the consumer of the API. Subsequent optional arguments are
 *  optionally passed through a hash (Object) as the penultimate argument
 *  (preceeding the also-optional callback argument, which always comes last)
 */
module.exports = function Method(spec) {
  const commandPath = utils.makeURLInterpolator(spec.path || '');
  const requestMethod = (spec.method || 'GET').toUpperCase();
  const urlParams = spec.urlParams || [];

  return function (...args) {
    const self = this;

    const callback = typeof args[args.length - 1] === 'function' && args.pop();
    const auth = args.length > urlParams.length && typeof args[args.length - 1] === 'string' ? args.pop() : null;
    const data = utils.isObject(args[args.length - 1]) || utils.isArrayObject(args[args.length - 1]) ? args.pop() : {};
    const urlData = this.createUrlData();

    return this.wrapTimeout(new Promise(((resolve, reject) => {
      for (let i = 0, l = urlParams.length; i < l; i += 1) {
        urlData[urlParams[i]] = args.shift();
      }
      const requestPath = this.createFullPath(commandPath, urlData);

      self._request(requestMethod, requestPath, data, auth, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    })), callback);
  };
};
