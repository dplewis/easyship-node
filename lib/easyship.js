function Easyship(token) {
  if (!(this instanceof Easyship)) {
    return new Easyship(token);
  }
  this._api = {
    host: Easyship.DEFAULT_HOST,
    port: Easyship.DEFAULT_PORT,
    protocol: Easyship.DEFAULT_PROTOCOL,
    basePath: Easyship.DEFAULT_BASE_PATH,
    timeout: Easyship.DEFAULT_TIMEOUT,
    userAgent: Easyship.USER_AGENT,
    token: token,
    dev: false,
  };
  this._init();
}

Easyship.DEFAULT_HOST = 'api.easyship.com';
Easyship.DEFAULT_PROTOCOL = 'https';
Easyship.DEFAULT_PORT = '443';
Easyship.DEFAULT_BASE_PATH = '/';
Easyship.DEFAULT_TIMEOUT = 30000; // 30 seconds; override with setTimeout on Easyship instance
Easyship.PACKAGE_VERSION = require('../package.json').version;

Easyship.USER_AGENT = `Easyship/v1 NodeBindings/${Easyship.PACKAGE_VERSION}`;

Easyship.resources = {
  Categories: require('./resources/Categories'),
  Label: require('./resources/Label'),
  Pickup: require('./resources/Pickup'),
  Rate: require('./resources/Rate'),
  Shipment: require('./resources/Shipment'),
  Track: require('./resources/Track'),
};

Easyship.Error = require('./Error');
Easyship.Resource = require('./Resource');

Easyship.prototype = {
  setAuthScheme(auth) {
    this.set('authScheme', auth);
  },

  setHost(host, port, protocol) {
    this.set('host', host);
    if (port) this.set('port', port);
    if (protocol) this.set('protocol', protocol);
  },

  setProtocol(protocol) {
    this.set('protocol', protocol.toLowerCase());
  },

  setPort(port) {
    this.set('port', port);
  },

  setToken(token) {
    this.set('token', token);
  },

  setTimeout(timeout) {
    this.set('timeout', timeout == null ? Easyship.DEFAULT_TIMEOUT : timeout);
  },

  set(key, value) {
    this._api[key] = value;
  },

  get(key) {
    return this._api[key];
  },

  _init() {
    Object.keys(Easyship.resources).forEach((name) => {
      this[name.toLowerCase()] = new Easyship.resources[name](this);
    });
    this.error = Easyship.Error;
  },
};

module.exports = Easyship;
