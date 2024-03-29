var express = require('express');
var app = express();
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/js', express.static(__dirname + '/js'));
app.use('/styles', express.static(__dirname + '/styles'));

app.listen(3000);