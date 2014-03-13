
var express = require('express');
var http = require('http');
var path = require('path');

var data = require('./data/world-pop.json');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + '/client');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'client')));
app.use(express.errorHandler());

app.get('/', function(req, res) {
  res.render('index', { worldPopData: JSON.stringify(data) });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
