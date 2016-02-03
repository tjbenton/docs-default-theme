/* eslint
  no-var: 0,
  no-unused-vars: 0,
  no-shadow: 0,
  prefer-arrow-callback: 0,
  max-params: 0,
  id-length: 0,
  prefer-template: 0
*/
var stylus = require('stylus');
var utils = stylus.utils;
var nodes = stylus.nodes;
module.exports = function plugin() {
  return function plugin(style) {
    style.define('-slice', function slice(val, start, end) {
      var vals = [].slice.call(arguments);

      if (vals.length > 3) {
        val = vals.slice(0, -2).map(function values(obj) {
          return obj.val;
        });

        vals = vals.slice(-2);
        start = vals[0];
        end = vals[1];

        return val.slice(start, end);
      }

      return null;
    });

    style.define('match', function match(pattern, val) {
      utils.assertType(pattern, 'string', 'pattern');
      utils.assertString(val, 'val');
      var re = new RegExp(pattern.val);
      return val.string.match(re);
    });
  };
};
