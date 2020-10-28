const { expect } = require('chai');
const easyship = require('./testUtils').getSpyableEasyship('token');

describe('easyship', () => {
  it('can get default', () => {
    expect(easyship.get('host')).to.equal('api.easyship.com');
    expect(easyship.get('port')).to.equal('443');
    expect(easyship.get('protocol')).to.equal('https');
    expect(easyship.get('basePath')).to.equal('/');
    expect(easyship.get('timeout')).to.equal(30000);
  });

  it('setters and getters', () => {
    easyship.setAuthScheme('oauth');
    expect(easyship.get('authScheme')).to.equal('oauth');

    easyship.setHost('examples.com');
    expect(easyship.get('host')).to.equal('examples.com');

    easyship.setHost('example.com', '8080', 'http');
    expect(easyship.get('host')).to.equal('example.com');
    expect(easyship.get('port')).to.equal('8080');
    expect(easyship.get('protocol')).to.equal('http');

    easyship.setProtocol('wss');
    expect(easyship.get('protocol')).to.equal('wss');

    easyship.setPort('1337');
    expect(easyship.get('port')).to.equal('1337');

    easyship.setTimeout(5000);
    expect(easyship.get('timeout')).to.equal(5000);

    easyship.setTimeout();
    expect(easyship.get('timeout')).to.equal(30000);

    easyship.setToken('apiKey');
    expect(easyship.get('token')).to.equal('apiKey');
  });
});
