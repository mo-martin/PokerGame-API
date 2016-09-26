var express = require('express');
var app = express();
var router = require('./config/routes');
var mongoose = require('mongoose');
var path = require('path');

var port = process.env.PORT || 3000;

app.use(router);

mongoose.connect('mongodb://localhost/Poker', function(){
  console.log("Database connected");
})

app.listen(port, function() {
  console.log("Express app is listening on port: " + port);
});
