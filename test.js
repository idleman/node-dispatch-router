
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
    // We must check its context. was if multiple requessts are routed in parallel.
    describe('GET', function () {
      function createRequest() {
        var argv = Array.prototype.slice.call(arguments),
            url = '/' + argv.join('/');

        return {
          method: 'GET',
          url: url
        };
      }

      function createResponse(expected, cb) {
        return {
          end: function (data) {
            assert.equal(data, expected);
            cb();
          }
        };
      }
      it('/', function (next) {
        var req = createRequest();
        var res = createResponse('/hello-world', next);
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('/add', function (next) {
        var req = createRequest('add');
        var res = createResponse(0, next);
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });

      
      it('/add/hello', function (next) {
        var req = createRequest('add', 'hello');
        var res = createResponse('hello', next);
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      it('/add/hello/world', function (next) {
        var req = createRequest('add', 'hello', 'world');
        var res = createResponse('helloworld', next);
        //console.log('handler: ' + handler);
        handler(req, res, function (err) {
          assert.fail(err);
        });
      });
      describe('parallel', function () {
        it('GET /delay/100 AND /add/2/3', function (next) {
          var counter = 0;

          var req1 = createRequest('delay', 100);
          var res1 = createResponse('100', finish);
          var req2 = createRequest('add', 2, 3);
          var res2 = createResponse('23', finish);
          handler(req1, res1);
          handler(req2, res2);

          function finish(err) {
            if (++counter === 2) {
              next(err);
            } else if (err) {
              next(err);
            }
          }
        });

      });
    });
   
  });
});
/*
    
    describe('GET /sub', function () {
      function createRequest(method, param) {
        var url = '/sub';
        if (method !== undefined) {
          url += '/' + method;
        }
        if (param !== undefined) {
          url += '/' + param;
        }

        return {
          method: 'GET',
          url: url
        };
      }
      it('should invoke subcontroller', function (next) {
        var req = createRequest('reply', 'hello-world');
        var res = {
          end: function (data) {
            var res = JSON.parse(data);
            assert.equal(res, 'hello-world');
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
    */