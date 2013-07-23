node-dispatch-router
======================

Divide your routes into multiple files is often a good idea. However, how you would
structure them does people less talk about. This library aims to provide one
solution to that problem.

The idea is to use complete directories as "controllers" instead of one specific file.
The controller directory can then contain actions, error handlers and dispatchers (invoked
for each request that pass that folder). Example, say we got the following express app:

´´´
        var app = express();
            
        app.get('/', function (req, res) {
          res.end('hello world');
        });
        app.get('/posts/:category', function (req, res) {
          var category = req.param.category;
          res.end('post: ' + category);
        });
        app.post('/post/:id', function (req, res) {
          var id = req.param.id;
          res.end('post updated: ' + id);
        });
        //...
```
 We can translate it into the following dispatch-router controllers (files):

/index.js
´´´
        module.exports.get = function() {
          this.Response.end('hello world');
        };
```
/posts.js
´´´
        module.exports.get = function(category) {
          this.Response.end('post: ' + category);
        };
```

/post.js
´´´
        module.exports.get = function(id) {
          this.Response.end('post updated: ' + id);
        };
```
##Current status

Not stable for others requests than GET yet. However, you can use it with together with express:

´´´
        var router = require('dispatch-router'),
            express = require('express'),
            app = express();

        app.use(router.basic('absolute/path/to/your/root/controller'));
        app.use(function(req, res, next) {
          // router did not handle the request
        });

        app.listen(80);
```

##What with subfolders? 

If you want to create a subfolder, just create another folder within your base folder and so on:

/                 : GET /
/a                : GET /a
/a/b              : GET /a/b
/a/b/c            : GET /a/b/c


##Do you only want to run some type of code for some controllers?
Just create a dispatcher file:

.dispatcher.js
´´´
        module.exports = (function() {

          return {
            any: function(next) { // For each request

              if(this.Request.method !== 'GET') {
                return next(new Error('We do not support others http methods than GET right now :(');
              }
              
              next(); //continue to next handler.
            },
            get: function(next) { // For each 'GET' request,
              //maybe turn on or efficent caching here for this specific folder and all subfolders/controllers.
              next(); //continue to next handler.
            }
          };
        })();
´´´

##Middleware (for express to example)
´´´
        var router = require('dispatch-router'),
            express = require('express'),
            app = express();

        app.use(router.basic('absolute/path/to/your/root/controller');

        // ...
        app.listen(80);
        

```
##Performance? Better than express.

Are you using express today and scared to use dispatch-router? Don´t be.
Dispatch-router is in current shape faster than express (by 10%).



Checkout







        /index.js
        /posts.js
        /post.s        

If you have

This gives you a more scalable approach on many url. 

##Idea





´´´
    app.get('/', function(req, res) {
      //...
    });
    app.get('/user/:id', function(req, res) {
      //...
    });

´´´


´´´
    var router = require('dispatch-router');

    app.use(require(router.basic('



#Ambiguous routes priority

1. Try to check if itself hthere exists a action on that route.
2. .dispatch/{http_method}
3. 