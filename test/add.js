var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (a, b) { //will be any parameters, if passed.
      //only get request

      var a = (a === undefined)?'': a,
          b = (b === undefined)? '' : b;

      this.Response.end(a + b);
    }
  };

  
  return methods;
})();