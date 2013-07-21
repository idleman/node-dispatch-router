
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
    it('GET /', function (next) {
      var req = {
        method: 'GET',
        url: '/'
      };
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
    
    it('GET /show/12', function (next) {
      var req = {
        method: 'GET',
        url: '/show/12'
      };
      var res = {
        end: function (data) {
          var routes = JSON.parse(data);
          assert.equal(routes.length, 3);
          assert.equal(routes[0], '.dispatch/any');
          assert.equal(routes[1], '.dispatch/get');
          assert.equal(routes[2], 'show/get(12)');
          next();
        }
      };
      //console.log('handler: ' + handler);
      handler(req, res, function (err) {
        assert.fail(err);
      });
    });
  });
});
