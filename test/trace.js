var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function () { //will be any parameters, if passed.
      //only get request
      this.stackTrace.push('trace/get');
      this.Response.end(JSON.stringify(this.stackTrace));
    }
  };

  
  return methods;
})();