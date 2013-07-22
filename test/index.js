var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (id) { //will be any parameters, if passed.
      //only get request
      this.Response.end('/hello-world');
    }
  };

  
  return methods;
})();