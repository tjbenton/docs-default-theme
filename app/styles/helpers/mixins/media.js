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
var fs = require('fs');
var path = require('path');

module.exports = function plugin() {
  return function plugin(style) {
    style.define('-media', function this_media() {
      console.log([ 'one', 'two', 'three', 'four', 'five' ]);
      console.log({
        one: 1,
        two: 2,
        three: 3
      });

      return null;
    });

    style.define('set-media', function set_media(media) {
      // console.log(Object.getOwnPropertyNames(this));
      // console.log(this.options);
      // console.log(stylus);
      media = new nodes.Ident(media.val)
      var new_media = new nodes.Media(media)
      // new_media = new nodes.Ident(new_media.toString())
      // console.log(new_media);
      return new_media
      return null
    });
  };
};
