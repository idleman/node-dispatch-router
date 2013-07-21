
var assert = require("assert");

describe('dispatch-router', function () {
  var router = require('./index');

  it('#basic should be a function', function() {
    assert.equal(typeof router.basic, 'function');
  });
  describe('#basic', function () {
    var handler = null;
    before(function () {
      handler = router.basic(__dirname + '/test', {
        actionContext: {
          //we add support for doing this.View within any controller action.
          View: function (name, data) {
            // our custom defined function that will be added to the invocation context 
            assert.equal(typeof name, 'string');
            assert.equal(typeof this.Controller.src, 'string');
            this.Response.end(JSON.stringify(data));
          }
        }
      });
    });
    it('should return a function', function () {
      assert.equal(typeof handler, 'function');
    });
    describe('GET /', function () {
      var req = {
        method: 'GET',
        url: '/'
      };

      it('should invoke default action', function (next) { 
        var res = {
          end: function (data) {
            var routes = JSON.parse(data);
            assert.equal(routes.length, 3);
            assert.equal(routes[0], '.dispatch/any');
            assert.equal(routes[1], '.dispatch/get');
            assert.equal(routes[2], 'index/get()');
            next();
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
    });
    
    describe('GET /sub', function () {
      function createRequest(method) {
        var url = '/sub';
        if (method !== undefined) {
          url += '/' + method;
        }
        return {
          method: 'GET',
          url: url
        };
      }
      it('should invoke subcontroller', function (next) {
        var req = createRequest();
        var res = {
          end: function (data) {
            var routes = JSON.parse(data);
            assert.equal(routes.length, 5);
            assert.equal(routes[0], '.dispatch/any');
            assert.equal(routes[1], '.dispatch/get');
            assert.equal(routes[2], 'sub/.dispatch/any');
            assert.equal(routes[3], 'sub/.dispatch/get');
            assert.equal(routes[4], 'sub/.dispatch/index');
            next();
          }
        };
        handler(req, res, function (err) {
          assert.fail(err);
        });

      });
    });
    describe('GET /add/{a}/{b}', function () {
      function createRequest(a, b, c) {
        var url = '/add';
        if (a !== undefined) {
          url += '/' + a;
        }
        if (b !== undefined) {
          url +=  '/' + b;
        }
        if (c !== undefined) {
          url += '/' + c;
        }
        return {
          method: 'GET',
          url: url
        };
      }
      it('GET /add', function (next) {
        var req = createRequest();
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 0);
            next();
          }
        };
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('GET /add/', function (next) {
        var req = createRequest();
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 0);
            next();
          }
        };
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });

      it('GET /add/12', function (next) {
        var req = createRequest(12);
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 12);
            next();
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('GET /add/12/', function (next) {
        var req = createRequest(12);
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 12);
            next();
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('GET /add/12/3', function (next) {
        var req = createRequest(12, 3);
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 15);
            next();
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('GET /add/12/3/', function (next) {
        var req = createRequest(12, 3);
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 15);
            next();
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('GET /add/12/3/12', function (next) {
        var req = createRequest(12, 3, 12);
        var res = {
          end: function (data) {
            assert.fail('add does only accept 2 max two arguments, hence should this function never be called');
          }
        };
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          if (err) {
            assert.fail(err);
          }
          next();
        });
      });
    });
  });
});
