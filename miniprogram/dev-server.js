var express = require('express');
var path = require('path');

var app = new express();

app.use('/lib', express.static(path.join(__dirname + '/lib')));

app.get('/*.html', function(req, res, next) {
  res.type('text/html').sendFile(__dirname + req.url);
});

app.set('port', '9999');
app.listen(app.get('port'));
