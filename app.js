var express = require('express');
var app = express();
var router = require('./config/routes');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var path = require('path');
var cors = require('cors');

var port = process.env.PORT || 3001;
var dbUrl = process.env.DB_URL || 'mongodb://localhost/Poker';

app.use(cors());
app.use(bodyParser.json());
app.use(router);

mongoose.connect(dbUrl, function(){
  console.log("Database connected: DB_URL= " + dbUrl);
});
//post body parser

app.listen(port, function() {
  console.log("Express app for Poker API is listening on port: " + port);
});

module.exports = app;
