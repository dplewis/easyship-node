require('./testUtils');

const { expect } = require('chai');
const utils = require('../lib/utils');

describe('utils', () => {
  describe('makeURLInterpolator', () => {
    it('Interpolates values into a prepared template', () => {
      const template = utils.makeURLInterpolator('/some/url/{foo}/{baz}?ok=1');

      expect(
        template({ foo: 1, baz: 2 }),
      ).to.equal('/some/url/1/2?ok=1');

      expect(
        template({ foo: '', baz: '' }),
      ).to.equal('/some/url//?ok=1');
    });

    it('Interpolates special values', () => {
      const rc = {
        '\n': '\\n',
        '"': '\\"',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029',
      };
      const unescaped = Object.keys(rc).join();
      const template = utils.makeURLInterpolator(`/some/url/{foo}/{baz}/${unescaped}?ok=1`);

      expect(
        template({ foo: 1, baz: 2 }),
      ).to.equal('/some/url/1/2/\\n,\\",\\u2028,\\u2029?ok=1');
    });
  });

  describe('stringifyRequestData', () => {
    it('Creates a string from an object, handling shallow nested objects', () => {
      expect(utils.stringifyRequestData({
        test: 1,
        foo: 'baz',
        somethingElse: '::""%&',
        nested: {
          1: 2,
          'a n o t h e r': null,
        },
        arr: [1, 2, 3],
      })).to.equal([
        'test=1',
        'foo=baz',
        'somethingElse=%3A%3A%22%22%25%26',
        'nested%5B1%5D=2', // Unencoded: nested[1]=2
        'nested%5Ba%20n%20o%20t%20h%20e%20r%5D=',
        'arr%5B%5D=1',
        'arr%5B%5D=2',
        'arr%5B%5D=3',
      ].join('&'));
    });
    it('Ensures empty objects are represented', () => {
      expect(utils.stringifyRequestData({
        test: {},
      })).to.equal('test=');
    });
  });

  describe('protoExtend', () => {
    it('Provides an extension mechanism', () => {
      function A() {}
      A.extend = utils.protoExtend;
      const B = A.extend({
        constructor: function () {
          this.called = true;
        },
      });
      expect(new B()).to.be.an.instanceof(A);
      expect(new B()).to.be.an.instanceof(B);
      expect(new B().called).to.equal(true);
      expect(B.extend === utils.protoExtend).to.equal(true);
    });
  });
});
