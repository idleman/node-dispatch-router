var assert = require('assert');

module.exports = (function (undefined) {
  //can either

  // JavaScript does not support overloading, hence does we only use Function.length 
  // to determine if the method expects some parameter.
  var methods = {
    get: function (id) { //will be any parameters, if passed.
      //only get request
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(!!this.Error, true);
      assert.equal(this.Request.method, 'GET'); //custom function

      this.Response.routes.push('index/get(' + ((id === undefined) ? '' : id)  + ')');
      this.View('', this.Response.routes);
    },

    post: function (model) {
      assert.equal(typeof model, 'object');
      assert.equal(!!this.Request, 'function');
      assert.equal(!!this.Response, 'function');
      assert.equal(!!this.Error, 'function');
      assert.equal(this.Request.method, 'POST'); //custom function

      this.Response.routes.push('index/post');
      this.View('', model);
    }
  };

  
  return methods;
})();