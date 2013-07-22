var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (ms) { //will be any parameters, if passed.
      //only get request
      var ms = ms || 100;

      var self = this;
      setTimeout(function () {
        self.Response.end(ms);
      }, ms);
    }
  };

  
  return methods;
})();