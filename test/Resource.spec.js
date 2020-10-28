const { expect } = require('chai');
const nock = require('nock');
const utils = require('./testUtils');

const easyship = utils.getSpyableEasyship('apiKey');

describe('Resource', () => {
  it('_get_headers', async () => {
    const headers = easyship.rate._get_headers();
    expect(headers.Authorization).to.equal('Bearer apiKey');
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

  describe('Parameter encoding', () => {
    // Use a real instance of easyship as we're mocking the http.request responses.
    const realEasyship = require('../lib/easyship')(utils.getUserEasyshipKey());

    after(() => {
      nock.cleanAll();
    });

    describe('_request', () => {
      it('encodes data for GET requests with string param', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(200, '{}');

        realEasyship.shipment.retrieve('12345', (err, response) => {
          if (response) {
            done();
            scope.done();
          }
        });
      });

      it('encodes data for GET requests with query param', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345?format=url')
          .reply(200, '{}');

        realEasyship.shipment.retrieve('12345', { format: 'url' }, (err, response) => {
          if (response) {
            done();
            scope.done();
          }
        });
      });

      it('works correctly with undefined optional arguments', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(200, '{}');

        realEasyship.shipment.retrieve('12345', undefined, (err, response) => {
          if (response) {
            done();
            scope.done();
          }
        });
      });

      it('works correctly with null optional arguments', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(200, '{}');

        realEasyship.shipment.retrieve('12345', null, (err, response) => {
          if (response) {
            done();
            scope.done();
          }
        });
      });

      it('encodes data for DELETE requests as query params', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .delete('/shipment/v1/shipments/12345')
          .reply(200, '{}');

        realEasyship.shipment.del('12345', { foo: 'bar' }, (err, response) => {
          if (response) {
            done();
            scope.done();
          }
        });
      });
    });

    describe('_responseHandler', () => {
      it('Invalid response', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(200, null);

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Invalid JSON received from the Easyship API');
            done();
            scope.done();
          }
        });
      });

      it('401 Error', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(401, JSON.stringify({ message: 'Invalid Auth' }));

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Invalid Auth');
            done();
            scope.done();
          }
        });
      });

      it('404 Error', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(404, JSON.stringify({ message: 'Not Found' }));

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Not Found');
            done();
            scope.done();
          }
        });
      });

      it('301 Error', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(301, JSON.stringify({ message: 'Redirect Error' }));

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Redirect Error');
            done();
            scope.done();
          }
        });
      });

      it('400 Error', (done) => {
        const customMessage = JSON.stringify({
          'Exception:Managed': 'Not successful',
        });
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(400, customMessage);

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Not successful');
            done();
            scope.done();
          }
        });
      });

      it('200 with generic error', (done) => {
        const customMessage = JSON.stringify({
          error: 'Failed',
        });
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .reply(200, customMessage);

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('Generic');
            done();
            scope.done();
          }
        });
      });
    });

    describe('_errorHandler', () => {
      it('Invalid response', (done) => {
        const scope = nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .replyWithError('bad stuff');

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('An error occurred with our connection to Easyship');
            done();
            scope.done();
          }
        });
      });
    });

    describe('_timeoutHandler', () => {
      it('Invalid response', (done) => {
        easyship.set('timeout', 10);
        realEasyship.set('timeout', 10);
        nock(`https://${easyship.get('host')}`)
          .get('/shipment/v1/shipments/12345')
          .delay(1000)
          .delayBody(1000);

        realEasyship.shipment.retrieve('12345', (err) => {
          if (err) {
            expect(err.message).to.equal('An error occurred with our connection to Easyship');
            done();
          }
        });
      });
    });
  });
});
