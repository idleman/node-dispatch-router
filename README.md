node-dispatch-router
======================

Divide your routes into multiple files is often a good idea. However, how you would
structure them does people less talk about. This library aims to provide one
solution to that problem.

The idea is to use complete directories as "controllers" instead of one specific file.
The controller directory can then contain actions, error handlers and dispatchers (invoked
for each request that pass that folder). Example, say we got the following express app:

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

 We can translate it into the following dispatch-router controllers (files):

/index.js

        module.exports.get = function() {
          this.Response.end('hello world');
        };

/posts.js

        module.exports.get = function(category) {
          this.Response.end('post: ' + category);
        };

/post.js

        module.exports.get = function(id) {
          this.Response.end('post updated: ' + id);
        };

##Current status (Not ready for production)

Not stable for others requests than GET yet. However, you can use it with together with express:

        var router = require('dispatch-router'),
            express = require('express'),
            app = express();

        app.use(router.basic('absolute/path/to/your/root/controller'));
        app.use(function(req, res, next) {
          // router did not handle the request
        });

        app.listen(80);

However, it is not recommended.

##Template engines.

Do you want to enable your perfect template engine within your routes? Simple, just give a actionContext
to the construction method:

server.js

        app.use(router.basic('absolute/path/to/your/root/controller', {
          actionContext: {
            View: function(view, data) {
              // code here to generate the HTML code.

              var src = this.Controller.src; //path of the controller if you need it
              this.Response; //the response object.
            }
          }
        });


controllers/index.js

        module.exports = (function() {
          return {
            get:  function() {
              this.View('main', {
                title: 'startpage'
              });
            }
          };
        })();


It may be a great idea to define simliar functions for json, file, content:

        app.use(router.basic('absolute/path/to/your/root/controller', {
          actionContext: {
            Json: function(data) {
              this.Response.end(JSON.stringify(data));
            },
            Json: function(content) {
              this.Response.end(content);
            },
            File: function(src) {
              //use some effcient way to send the file contents and generate a download prompt
            }
          }
        });


controllers/index.js

        module.exports = (function() {
          return {
            get:  function() {
              this.Json({
                title: 'hello world'
              });
              // or
              this.Content('hello world');
              //or
              this.File('hello.bin')
            }
          };
        })();


##What with subfolders? 

If you want to create a subfolder, just create another folder within your base folder and so on:

/                 : GET /
/a                : GET /a
/a/b              : GET /a/b
/a/b/c            : GET /a/b/c


##Do you only want to run some type of code for some controllers?
This i when you should use dispatchers:

.dispatcher.js

        module.exports = (function() {

          return {
            any: function(next) {
              // For each request
              next();
            },
            get: function(next) { 
              // For each 'GET' request,
              next();
            }
          };
        })();

This is very good for logging, authentication, caching. Prefer to put common code within the dispatchers.


##Performance? Better than express.

Dispatch-router is in current shape faster than express (by 10%). However, the library
is in current shape not a complete webframework and does then implement all required http methods. 