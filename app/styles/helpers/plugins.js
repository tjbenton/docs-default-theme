// var stylus = require("stylus"),
//     nodes = stylus.nodes,
//     utils = stylus.utils;

var _ = require("lodash");


exports = module.exports = function(){
 // Remove single or double quotes from start and ending of string
 function unquote(str){
  return str.toString().replace(/^[\'\"]|[\'\"]$/g, "");
 }

 return function(stylus){
  stylus
   .define("str-replace", function(str, match, value){
    // Replace matching chars in str and replace with needed value
    return unquote(str).replace(unquote(match), unquote(value));
   })
   .define("str-split", function(str, match){
    return unquote(str).split(unquote(match));
   })
   .define("str-index", function(str, substr){
    return new stylus.nodes.Unit(str.string.indexOf(substr.string));
   })
   .define("str-slice", function(str, start, end){
    return new stylus.nodes.String(str.string.slice((start || {}).val, (end || {}).val));
   })
   .define("str-to-base64", function(str){
    // Encode string to base64 format
    return new Buffer(unquote(string)).toString("base64");
   })
   .define("_test", function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z){
    console.log(arguments);
    return null;
   });

  var __lodash = [];
  // console.log("_func", name);
  for(var name in _){
   var func = _[name];
   if(typeof func === "function"){
    __lodash.push(name);
    stylus.define("__" + name, function(){
     console.log(arguments);
     return "__" + name;
     // return _[name].apply(arguments);
    });
   }
  };

  stylus.define("$__lodash", __lodash);
 };
};