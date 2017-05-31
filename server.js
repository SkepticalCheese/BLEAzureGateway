/*
Web server code
*/
'use strict';

// load the things we need
var debug = require('debug')('server');
var express = require('express');
var app = express();

var Bleazure = require ('./bleazure.js');
var bleazure = new Bleazure();

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    var sensors = bleazure.getAllSensors();
    
    res.render('pages/index', {
        sensors: sensors
    });
});

app.listen(8080);
debug('listenig on port 8080');
