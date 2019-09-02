var express = require('express');
var app = express();
var http = require('http').Server(app);

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

http.listen(process.env.PORT || 3000);
