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
  let commandPath = utils.makeURLInterpolator(spec.path || '');
  const requestMethod = (spec.method || 'GET').toUpperCase();
  const urlParams = spec.urlParams || [];
  let optional = false; // check for optional parameters
  let optParam = 0; // check if optional parameters are provided by the user
  let optPath = utils.makeURLInterpolator(spec.path || '');
  let optPath2;
  if (spec.optPath !== undefined) {
    optPath = utils.makeURLInterpolator(spec.optPath || '');
    optional = true;
    optParam = 1;
  }
  if (spec.optPath2 !== undefined) {
    optPath2 = utils.makeURLInterpolator(spec.optPath2 || '');
    optional = true;
    optParam = 2;
  }
  return function (...args) {
    const self = this;

    const callback = typeof args[args.length - 1] === 'function' && args.pop();
    const auth = args.length > urlParams.length && typeof args[args.length - 1] === 'string' ? args.pop() : null;
    const data = utils.isObject(args[args.length - 1]) || utils.isArrayObject(args[args.length - 1]) ? args.pop() : {};
    const urlData = this.createUrlData();

    return this.wrapTimeout(new Promise(((resolve, reject) => {
      for (let i = 0, l = urlParams.length; i < l; i += 1) {
        const arg = args[0];
        if (urlParams[i] && !arg && !optional) {
          const err = new Error(`Easyship: I require argument "${urlParams[i]}", but I got: ${arg}`);
          reject(err);
          return;
        } // added handling for urlParams that are optional
        if (optional && urlParams[i] && !arg) {
          optParam -= 1;
          continue;
        }

        urlData[urlParams[i]] = args.shift();

        if (Object.prototype.hasOwnProperty.call(data, urlParams[i])) {
          delete data[urlParams[i]];
        }
      }

      // commandPath depending on the number of optional parameters
      switch (optParam) {
        case 1:
          commandPath = optPath;
          break;
        case 2:
          commandPath = optPath2;
          break;
        default:
          break;
      }
      const requestPath = this.createFullPath(commandPath, urlData);

      self._request(requestMethod, requestPath, data, auth, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            spec.transformResponseData
              ? spec.transformResponseData(response)
              : response,
          );
        }
      });
    })), callback);
  };
};
