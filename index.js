

function foreachFile(path, cb) {
  var files = fs.readdirSync(path);
  files.forEach(function (file) {
    /*if (file[0] === '.' || file === 'node_modules') {
      return;
    }*/
    var src = path + file;
    var info = fs.statSync(src);
    if (info.isDirectory()) {
      foreachFile(src + '/', cb);
    } else if (info.isFile()) {
      cb(src, info);
    }
  });
}


// The action should be invoked in a such context those methods in availble: this.Json, this.File, js.Content ? 

var fs = require('fs');
/*
function Controller(context) {
  var self = Controller,
      route = context.url.shift();

  var context = {
    Request: context.request,
    Response: context.response,
    Controller: {
      src: root + relative
    }
  };



  self.dispatch.any.apply(context, (req, res, function (err) {
    if (err) {
      return self.error(req, res, err, next);
    }
    var dispatch_method = self.dispatch[route];
    dispatch_method(req, res, function (err) {
      if (err) {
        return self.error(req, res, err, next);
      }
      if (context.url.length === 0) {
        var action = self.actions[route];
        if (action && action[context.method]) {
          var cb = action[context.method];
          var action_context = {
            Request: req,
            Response: res,
            Error: function (err) {
              self.error(req, res, err, next);
            }
          };
          return cb.call(action_context);
        }
      } else {
        var child = children[route];
        if (child) {
          child(context);
        }
      }

      return self.error(req, res, { code: 404 }, next);
    });
  });
}
Controller.parent = parent; //the owner (one directory level up)
Controller.dispatch = {
  any: function(req, res, next) {
    next();
  },
  options: function(req, res, next) {
    next();
  },
  post: function(req, res, next) {
    next();
  },
  del: function(req, res, next) {
    next();
  },
  head: function(req, res, next) {
    next();
  }
};
Controller.error = function(req, res, err, next) {
  next();
};

Controller.actions = {};
Controller.children = {};

*/

var http_route_map = {
  'GET': 'get',
  'POST': 'post',
  'HEAD': 'head',
  'OPTIONS': 'options'
};

function callNext() {
  this.next();
}

function createController(options, parent) { //relative will be used to find correct action4 xz 
  //ignore extension in request, and allow the application to take it as a hint to what it should return
  function Controller(req, res, next, context) {
    if(req.url.indexOf(options.relativeDir) !== 0) {
      next();
    }
    var self = Controller;

    if(!context) {
      context = {
        Controller: {
          src: self.src
        },
        Request: req,
        Response: res,
        Error: function (err) {
          if (self._error) {
            if (err && err.code && self._error[err.code]) {
              return self._error[err.code].call(context, err);
            } else {
              return self._error.any.call(context, err);
            }
          } else {
            next(err);
          }
        }
      };

      var tmp = options.actionContext;
      for (var prop in tmp) {
        if (tmp.hasOwnProperty(prop) && !context[prop]) {
          context[prop] = tmp[prop];
        }
      }

    }

    
    function intercept(cb) {
      return function(err) {
        if(err) {
          context.Error(err);
        } else {
          cb();
        }
      }
    }

    context.next = intercept(function () {
      var http_method = http_route_map[context.Request.method],
          dispatch_method = self._dispatch[http_method];

      context.next = intercept(function () {
        
        var url = context.Request.url,
            urlLeft = url.substr(options.relativeDir.length),
            url = require('url').parse(urlLeft);

        if(!url.pathname) {
          //no more routes, it must be default action
          context.next = intercept(next);

          var action = self._actions[self.defaultAction],
              cb = null;
          if(!action || !(cb = action[http_method])) {
            return next();
          }
          return cb.call(context);
        }

        var routesLeft = url.pathname.split('/'),
            nextRoute = routesLeft.shift(),
            action = self._actions[nextRoute];

        if(action && (cb = action[http_method]) && routesLeft.length <= cb.length ) {
          //the controller has a own action that has correct interface.
          context.next = intercept(check_children);
          return cb.apply(context, routesLeft);
        }

        check_children();

        function check_children() {
          // check if we got a sub controller by that name (nextRoute)
          var child = self._children[nextRoute];
          if (child) {
            // it exists, lets use it.
            return child(req, res, intercept(next), context);
          }
          next();
        }
      });
      dispatch_method.call(context, context.next);
    });

    self._dispatch.any.call(context, context.next);

  }
  
  Controller.src = options.baseDir + options.relativeDir;

  Controller._dispatch = {
    defaultAction: 'index',
    any: callNext,
    get: callNext,
    options: callNext,
    post: callNext,
    del: callNext,
    head: callNext
  };
  Controller.defaultAction = Controller._dispatch.defaultAction;
  Controller._actions = {};
  Controller._children = {};


  require('fs').readdirSync(Controller.src).forEach(function (file) {
    var filepath = Controller.src + '/' + file,
        info = fs.statSync(filepath);

    if (info.isFile() && file.indexOf('.js', file.length - 3) !== -1) {
      // it is a .js file
      file = file.replace(/\.[^/.]+$/, "") // remove extension: .js 
      if (file[0] === '.') {
        //special file
        var short_name = '_' + file.substring(1),
            special = require(filepath);

        Controller[short_name] = Controller[short_name] || {};

        var ref = Controller[short_name];
        for (var method in special) {
          if (special.hasOwnProperty(method)) {
            ref[method] = special[method];
          }
        }
      } else {
        // method
        Controller._actions[file] = require(filepath);
      }
    } else if (info.isDirectory()) {
      Controller._children[file] = createController({
        baseDir: options.baseDir,
        relativeDir: options.relativeDir + file + '/',
        actionContext: context
      }, Controller);
    }
  });
  return Controller;
}


function basic (src, options) {
  var options = options || {},
      controller = createController({
        baseDir: src,
        relativeDir: '/',
        actionContext: options.actionContext || {}
      }),
      path = require('path');

  return function(req, res, next) {
    var url = req.url;
    if(-1 < url.indexOf('..') || url[0] !== '/') {
      return next(new Error('Bad request'));
    }
    if(!http_route_map[req.method]) {
      return next(new Error('Operation not ssupported'));
    }

    return controller(req, res, next);
  };
}

module.exports = {
  basic: basic
};

/*
  var dirpath = root + '/' + relative;
  var files = fs.readdirSync(dirpath);

  files.forEach(function (file) {
    var filepath = dirpath + '/' + file;
    var info = fs.statSync(filepath);

    if (info.isFile() && file.indexOf('.js', file.length - 3) !== -1) {
      // it is a .js file
      file = file.replace(/\.[^/.]+$/, "") // remove extension: .js 
      if (file[0] === '.') {
        //special file
        var short_name = file.substring(1);
        var special = require(filepath);
        Controller[short_name] = Controller[short_name] || {};
        var ref = Controller[short_name];
        for(var method in special) {
          if(special.hasOwnProperty(method)) {
            ref[method] = special[method];
          }
        }
      } else {
        // method
        Controller.actions[file] = require(filepath);
      }
    } else if (info.isDirectory()) {
      Controller.children[file] = createController(relative + file, root, Controller);
    }
  });
  */