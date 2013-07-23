var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (a) { //will be any parameters, if passed.
      //only get request
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(!!this.Error, true);
      assert.equal(this.Request.method, 'GET'); //custom function

      var a = (a === undefined) ? '' : a;

      this.Response.end(a);
    }
  };

  
  return methods;
})();