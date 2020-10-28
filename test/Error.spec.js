require('./testUtils');

const { expect } = require('chai');
const { EasyshipError, EasyshipAPIError, generate } = require('../lib/Error');
const easyship = require('./testUtils').getSpyableEasyship();

describe('Error', () => {
  it('Generates specific error message', () => {
    const genericError = generate();
    expect(genericError).to.be.instanceOf(Error);
    expect(genericError.message).to.equal('Generic');
  });

  it('create new error', () => {
    const error = new EasyshipError();
    expect(error.type).to.equal('EasyshipError');
  });

  it('Populates named parameters', () => {
    const fields = {
      statusCode: 400, detail: { stuff: 'is bad' }, message: 'bad stuff', path: '/badpath/',
    };
    const e = new EasyshipAPIError(fields);
    Object.keys(fields).forEach((k) => {
      expect(e[k]).to.eql(fields[k]);
    });
  });

  it('Handle request error', async () => {
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
