const http = require('http');
const https = require('https');
const path = require('path');
const querystring = require('querystring');
const utils = require('./utils');
const {
  EasyshipAPIError,
  EasyshipAuthenticationError,
  EasyshipConnectionError,
  EasyshipNotFoundError,
  EasyshipError,
} = require('./Error');

/**
 * Encapsulates request logic for a Easyship Resource
 */
function Resource(easyship, urlData) {
  this._easyship = easyship;
  this._urlData = urlData || {};

  this.basePath = utils.makeURLInterpolator(easyship.get('basePath'));
  this.path = utils.makeURLInterpolator(this.path);

  if (this.operations) {
    this.operations.forEach(function (methodName) {
      this[methodName] = Resource.BASIC_METHODS[methodName];
    }, this);
  }
}

Resource.extend = utils.protoExtend;

// Expose method-creator & prepared (basic) methods
Resource.method = require('./Method');
Resource.BASIC_METHODS = require('./Method.basic');

Resource.prototype = {
  path: '',

  createFullPath(commandPath, urlData) {
    return path.join(
      this.basePath(urlData),
      this.path(urlData),
      typeof commandPath === 'function'
        ? commandPath(urlData) : commandPath,
    ).replace(/\\/g, '/'); // ugly workaround for Windows
  },

  createUrlData() {
    const urlData = {};
    // Merge in baseData
    // for (const i in this._urlData) {
    //   if (hasOwn.call(this._urlData, i)) {
    //     urlData[i] = this._urlData[i];
    //   }
    // }
    return urlData;
  },

  wrapTimeout(promise, callback) {
    if (callback) {
      // Callback, if provided, is a simply translated to Promise'esque:
      // (Ensure callback is called outside of promise stack)
      promise.then((res) => {
        setTimeout(() => {
          callback(null, res);
        }, 0);
      }, (err) => {
        setTimeout(() => {
          callback(err, null);
        }, 0);
      });
    }

    return promise;
  },

  _timeoutHandler(timeout, req, callback) {
    const self = this;
    return function () {
      const timeoutErr = new Error('ETIMEDOUT');
      timeoutErr.code = 'ETIMEDOUT';

      req._isAborted = true;
      req.abort();

      callback.call(
        self,
        new EasyshipConnectionError({
          message: `Request aborted due to timeout being reached (${timeout}ms)`,
          detail: timeoutErr,
        }),
        null,
      );
    };
  },

  _responseHandler(req, callback) {
    const self = this;
    return function (res) {
      let response = '';

      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        let err;

        try {
          response = JSON.parse(response);
          if (!response) {
            throw new Error('Invalid Response');
          }
        } catch (e) {
          return callback.call(
            self,
            new EasyshipAPIError({
              message: 'Invalid JSON received from the Easyship API',
              statusCode: res.statusCode,
              path: req.path,
            }),
            null,
          );
        }
        let message = response.error || response.message;
        if (!message && typeof response === 'object' && Object.keys(response).length === 1) {
          message = response[Object.keys(response)[0]];
        }
        const errData = {
          detail: response,
          path: req.path,
          statusCode: res.statusCode,
          message,
        };
        if (res.statusCode === 401) {
          err = new EasyshipAuthenticationError(errData);
        } else if (res.statusCode === 404) {
          err = new EasyshipNotFoundError(errData);
        } else if (res.statusCode === 301) {
          err = new EasyshipAPIError(errData);
        } else if (res.statusCode === 400) {
          err = new EasyshipAPIError(errData);
        }
        if (!err && typeof response.error === 'string') {
          err = EasyshipError.generate(errData);
        }
        if (err) {
          return callback.call(self, err, null);
        }
        return callback.call(self, null, response);
      });
    };
  },

  _errorHandler(req, callback) {
    const self = this;
    return function (error) {
      if (req._isAborted) {
        return;
      }
      callback.call(
        self,
        new EasyshipConnectionError({
          message: 'An error occurred with our connection to Easyship',
          detail: error,
        }),
        null,
      );
    };
  },

  _get_headers() {
    const headers = {
      Authorization: `Bearer ${this._easyship.get('token')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': this._easyship.get('userAgent'),
    };
    return headers;
  },

  _request(method, route, data, auth, callback) {
    let requestPath = route;
    const requestData = JSON.stringify(data || {});
    const self = this;

    if (method === 'GET') {
      const queryParams = querystring.stringify(data);

      if (queryParams) {
        requestPath = [requestPath, queryParams].join('?');
      }
    }

    const headers = self._get_headers();

    function makeRequest() {
      const timeout = self._easyship.get('timeout');
      const requestObj = {
        host: self._easyship.get('host'),
        port: self._easyship.get('port'),
        path: requestPath,
        method,
        headers,
      };
      const req = (
        self._easyship.get('protocol') === 'http' ? http : https
      ).request(requestObj);

      req.setTimeout(timeout, self._timeoutHandler(timeout, req, callback));
      req.on('response', self._responseHandler(req, callback));
      req.on('error', self._errorHandler(req, callback));

      req.write(requestData);
      req.end();
    }

    makeRequest();
  },
};

module.exports = Resource;
