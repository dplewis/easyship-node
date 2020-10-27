require('./testUtils');

const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship('apiKey');

describe('Resource', () => {
  it('_get_headers', async () => {
    // console.log(easyship.rate._get_headers());
    // easyship.rate._request = function (method, url, data, auth, cb) {
    //   cb.call(this, 'Invalid Request', null);
    // };
    // easyship.rate.create((err, response) => {
    //   expect(err).to.equal('Invalid Request');
    //   expect(response).to.equal(null);
    // });
  });

  it('Handle callback request error', async () => {
    const resp = {
      message: 'success',
    };
    easyship.rate._request = function (method, url, data, auth, cb) {
      cb.call(this, null, resp);
    };
    easyship.rate.create((err, response) => {
      expect(err).to.equal(null);
      expect(response).to.equal(resp);
    });
  });

  it('Handle callback request error', async () => {
    easyship.rate._request = function (method, url, data, auth, cb) {
      cb.call(this, 'Invalid Request', null);
    };
    easyship.rate.create((err, response) => {
      expect(err).to.equal('Invalid Request');
      expect(response).to.equal(null);
    });
  });

  it('Handle promise request error', async () => {
    easyship.rate._request = function (method, url, data, auth, cb) {
      cb.call(this, 'Invalid Request', null);
    };
    try {
      await easyship.rate.create();
      expect(true).to.equal(false);
    } catch (e) {
      expect(e).to.equal('Invalid Request');
    }
  });
});
