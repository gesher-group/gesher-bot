var express = require('express');
var bodyParser = require('body-parser');
var inHandler = require('./handlers/in');
var outHandler = require('./handlers/out');
var rollHandler = require('./handlers/slash/roll');
 
var app = express();
var port = process.env.PORT || 3000;
 
// body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
 
// handler mapping
app.post('/inhook', inHandler);
app.post('/outhook', outHandler);
app.post('/slash/roll', rollHandler);
 
// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});
 
app.listen(port, function () {
  console.log('Slack bot listening on port ' + port);
});