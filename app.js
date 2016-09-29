var express = require('express');
var app = express();
var router = require('./config/routes');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var path = require('path');
var cors = require('cors');

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(router);

mongoose.connect(process.env.DB_URL || 'mongodb://192.10.10.200/Poker', function(){
  console.log("Database connected");
});
//post body parser



app.listen(port, function() {
  console.log("Express app is listening on port: " + port);
});

module.exports = app;
