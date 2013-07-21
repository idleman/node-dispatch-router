var assert = require('assert');

module.exports = (function () {
  //can either
  return {
    defaultAction: 'index',
    any: function (next) {
      // run by all methods
      assert.equal(typeof next, 'function');
      assert.equal(!!this.Controller,true);
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(typeof this.View, 'function'); //custom function

      this.Response.routes = ['.dispatch/any'];
      next();
    },

    get: function (next) {
      //only get request
      assert.equal(typeof next, 'function');
      assert.equal(!!this.Controller, true);
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(typeof this.View, 'function'); //custom function
      assert.equal(this.Request.method, 'GET'); //custom function
      this.Response.routes.push('.dispatch/get');
      next();
    },

    post: function (next) {
      //only post requests
      assert.equal(typeof next, 'function');
      assert.equal(!!this.Controller, true);
      assert.equal(!!this.Request, true);
      assert.equal(!!this.Response, true);
      assert.equal(typeof this.View, 'function'); //custom function
      assert.equal(this.Request.method, 'POST');
      this.Response.routes.push('.dispatch/post');
      next();
    }
  };
})();