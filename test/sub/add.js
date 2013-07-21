var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (a, b) { //will be any parameters, if passed.
      //only get request
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(!!this.Error, true);
      assert.equal(this.Request.method, 'GET'); //custom function

      var a = (a === undefined) ? 0 : a,
          b = (b === undefined) ? 0 : b,
          a = parseInt(a),
          b = parseInt(b);

      this.View('', a + b);
    }
  };

  
  return methods;
})();