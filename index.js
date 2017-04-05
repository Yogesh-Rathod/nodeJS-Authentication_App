// require All Node Dependencies
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var cors = require('cors');

// require All Local Dependencies
var config = require('./app/config');
var apiController = require('./app/controller/apiController');

// Set Port To be used
var port = process.env.PORT || 3000;

// Using cors for Cross domain Api Requests
app.use(cors());

// Static Assets
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Mongoose Connection To Database
mongoose.connect( config.dbConnection() );

// Start the App
apiController(app);

app.listen( port, function() {
  console.log('App is running on port', port);
});

