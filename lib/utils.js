const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const { toString } = {};

const utils = module.exports = {
  isObject(o) {
    return toString.call(o) === '[object Object]';
  },

  isArrayObject(o) {
    return toString.call(o) === '[object Array]';
  },

  /**
   * Stringifies an Object, accommodating a single-level of nested objects
   * (forming the conventional key "parent[child]=value")
   */
  stringifyRequestData(data) {
    function encode(v) {
      return v == null ? '' : encodeURIComponent(v);
    }
    const output = [];

    for (const i in data) {
      if (hasOwn(data, i)) {
        if (utils.isObject(data[i])) {
          let hasProps = false;
          for (const ii in data[i]) {
            if (hasOwn(data[i], ii)) {
              hasProps = true;
              output.push(`${encode(`${i}[${ii}]`)}=${encode(data[i][ii])}`);
            }
          }
          if (!hasProps) {
            output.push(`${encode(i)}=${encode('')}`);
          }
        } else if (Array.isArray(data[i])) {
          for (let a = 0, l = data[i].length; a < l; a += 1) {
            output.push(`${encode(`${i}[]`)}=${encode(data[i][a])}`);
          }
        } else {
          output.push(`${encode(i)}=${encode(data[i])}`);
        }
      }
    }

    return output.join('&');
  },

  /**
   * Outputs a new function with interpolated object property values.
   * Use like so:
   *   var fn = makeURLInterpolator('some/url/{param1}/{param2}');
   *   fn({ param1: 123, param2: 456 }); // => 'some/url/123/456'
   */
  makeURLInterpolator: (() => {
    const rc = {
      '\n': '\\n',
      '"': '\\"',
      '\u2028': '\\u2028',
      '\u2029': '\\u2029',
    };
    return (str) => {
      const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
      return (outputs) => cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => encodeURIComponent(outputs[$1] || ''));
    };
  })(),

  /**
   * Provide simple "Class" extension mechanism
   */
  protoExtend(sub) {
    const Super = this;
    const Constructor = hasOwn(sub, 'constructor') ? sub.constructor : function (...args) {
      Super.apply(this, args);
    };
    Object.assign(Constructor, Super);
    Constructor.prototype = Object.create(Super.prototype);
    Object.assign(Constructor.prototype, sub);

    return Constructor;
  },

};
