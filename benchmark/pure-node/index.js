var http = require('http');

http.createServer(function(req, res) {
  
  res.end('test');
}).listen(8080, 'localhost');