// NOTE: testUtils should be require'd before anything else in each spec file!
require('chai');

const utils = module.exports = {
  getUserEasyshipKey() {
    return process.env.EASYSHIP_TEST_API_KEY || ('unittest');
  },

  getSpyableEasyship(token) {
    // Provide a testable easyship instance
    // That is, with mock-requests built in and hookable

    const easyship = require('../lib/easyship');
    const easyshipInstance = easyship(token || 'fakeAuthToken');

    easyshipInstance.REQUESTS = [];

    for (const i in easyshipInstance) {
      if (easyshipInstance[i] instanceof easyship.Resource) {
        easyshipInstance[i]._request = function (method, url, data, auth, cb) {
          const req = easyshipInstance.LAST_REQUEST = {
            method,
            url,
            data,
          };
          if (auth) req.auth = auth;
          easyshipInstance.REQUESTS.push(req);
          cb.call(this, null, {});
        };
      }
    }

    return easyshipInstance;
  },

  /**
   * A utility where cleanup functions can be registered to be called post-spec.
   * CleanupUtility will automatically register on the mocha afterEach hook,
   * ensuring its called after each descendent-describe block.
   */
  CleanupUtility: (function () {
    function CleanupUtility(timeout) {
      const self = this;
      this._cleanupFns = [];
      this._easyship = require('../lib/easyship')(
        utils.getUserEasyshipKey(),
        'latest',
      );
      afterEach(function (done) {
        this.timeout(timeout || CleanupUtility.DEFAULT_TIMEOUT);
        return self.doCleanup(done);
      });
    }
    CleanupUtility.DEFAULT_TIMEOUT = 20000;

    CleanupUtility.prototype = {
      doCleanup(done) {
        const cleanups = this._cleanupFns;
        const total = cleanups.length;
        let completed = 0;
        let fn;
        while ((fn = cleanups.shift())) {
          const promise = fn.call(this);
          if (!promise || !promise.then) {
            throw new Error(
              'CleanupUtility expects cleanup functions to return promises!',
            );
          }
          promise.then(
            () => {
              // cleanup successful
              completed += 1;
              if (completed === total) {
                done();
              }
            },
            (err) => {
              // not successful
              throw err;
            },
          );
        }
        if (total === 0) {
          done();
        }
      },
      add(fn) {
        this._cleanupFns.push(fn);
      },
      deleteAddress(addId) {
        this.add(function () {
          return this._easyship.address.del(addId);
        });
      },
    };

    return CleanupUtility;
  }()),
};
