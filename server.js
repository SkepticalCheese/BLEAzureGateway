/*
Web server code
*/
'use strict';

// load the modules we need
var debug = require('debug')('server');
var express = require('express');
var bodyParser = require('body-parser');

// sets up express to use JSON encodeb bodies
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());

var Bleazure = require ('./bleazure.js');
var bleazure = new Bleazure('./bleasure.json', 'devices.json');

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    sendHome(res);
});

app.get('/edit/:sensorId', function(req, res) {
//    debug ('edit', sensor);
    var sensor = bleazure.getSensorById(req.params.sensorId);
//    debug ('edit', sensor);
    res.render('pages/edit', {
        sensor: sensor
    });
});

// This route receives the posted form.
app.post('/edit/:sensorId', function(req, res){
    var name = req.body.name;
    debug ('post name:', name);
    sendHome(res);
    bleazure.setSensorName (req.params.sensorId, name);
});

// Helpers
function sendHome(res) {
    var sensors = bleazure.getAllSensors();
    
    res.render('pages/index', {
        sensors: sensors
    });
}

app.listen(8080);
debug('listening on port 8080');
