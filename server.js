/*
Web server code
*/
'use strict';

// load the modules we need
var debug = require('debug')('server');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// sets up express to use JSON encodeb bodies

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(express.static(__dirname + '/node_modules')); 

var Bleazure = require ('./bleazure.js');
var bleazure = new Bleazure('./bleasure.json', 'sensors.json');

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    sendHome(res);
});


// Scan page
io.on('connection', function (socket) {
    debug ('socket connected');
});

app.get('/scan', function(req, res) {
    res.render('pages/scan', {
        sensors: bleazure.getFoundSensors()
    });

    bleazure.startScanning(function () {
        debug ('callback called');
        io.emit('refresh', { refresh: true });
    });
});

// Edit sensor name page
app.get('/edit/:sensorId', function(req, res) {
//    debug ('edit', sensor);
    var sensor = bleazure.getSensorById(req.params.sensorId);
//    debug ('edit', sensor);
    res.render('pages/edit', {
        sensor: sensor
    });
});

// posted form from the edit page above
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

//app.listen(8080);
server.listen(8080);
debug('listening on port 8080');
