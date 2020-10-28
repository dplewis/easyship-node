const { expect } = require('chai');
const nock = require('nock');
const utils = require('./testUtils');

const easyship = utils.getSpyableEasyship('apiKey');

describe('Timeout', () => {
  // Use a real instance of easyship as we're mocking the http.request responses.
  const realEasyship = require('../lib/easyship')(utils.getUserEasyshipKey());

  after(() => {
    nock.cleanAll();
  });

  it('abort', (done) => {
    easyship.set('timeout', 10);
    realEasyship.set('timeout', 10);
    nock(`https://${easyship.get('host')}`)
      .get('/shipment/v1/shipments/12345')
      .delay(1000)
      .delayBody(1000);

    realEasyship.shipment.retrieve('12345', (err) => {
      if (err) {
        expect(err.message).to.equal('Request aborted due to timeout being reached (10ms)');
        done();
      }
    });
  });
});
