node-dispatch-router
======================

Divide your routes into multiple files is often a good idea. However, how you would
structure them does people less talk about. This is mine solution to that mess.



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