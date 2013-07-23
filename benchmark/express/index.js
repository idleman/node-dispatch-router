var express = require('express'),
    app = express();
  
app.get('/', function (req, res) {
  res.end('test');
});

app.listen(8080, '127.0.0.1');
