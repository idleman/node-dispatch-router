var http = require('http'),
    router = require('./../../index');

var controller = router.basic(__dirname + '/controllers');
http.createServer(controller).listen(8080, 'localhost');