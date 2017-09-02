var path = require('path');
var express = require('express');
var routes = require('./routes');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

var staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

//Routes
app.use('/', routes);

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
