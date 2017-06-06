/*
Web server code
*/
'use strict';

// load the modules we need
var debug = require('debug')('server');
//var path = require('path');
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
    sendHome(res, null, null);
});

// Unpair sensor
app.get('/unpair/:sensorId', function(req, res) {
    bleazure.unpairSensor(req.params.sensorId);
    sendHome(res, 'unpairing sensor ' + req.params.sensorId, 'alert alert-info');
});

// Scan page
//io.on('connection', function (socket) {
//    debug ('socket connected');
//});

app.get('/scan', function(req, res) {
    res.render('pages/scan', {
        sensors: bleazure.getFoundSensors()
    });

    bleazure.startScanning(function () {
        debug ('scan callback called');
        io.emit('refresh', { refresh: true });
    });
});

// Pair new sensor
app.get('/pair/:sensorId', function(req, res) {
    bleazure.pairSensor(req.params.sensorId, req.params.sensorId);
    sendHome(res, 'pairing sensor ' + req.params.sensorId, 'alert alert-info');
});

// Edit sensor name page
app.get('/edit/:sensorId', function(req, res) {
    var sensor = bleazure.getSensorById(req.params.sensorId);
    res.render('pages/edit', {
        sensor: sensor
    });
});

// posted form from the edit page above
app.post('/edit/:sensorId', function(req, res){
    var name = req.body.name;
    debug ('post name:', name);
    bleazure.setSensorName (req.params.sensorId, name);
    res.send('done!');
    //res.redirect ('/');
    //sendHome(res, 'Name has been updated!', 'alert alert-info');
});

// Helpers
function sendHome(res, messageText, messageClass) {
    var sensors = bleazure.getAllSensors();
    res.render('pages/index', {
        sensors: sensors, messageText: messageText, messageClass: messageClass
    });
}

//app.listen(8080);
server.listen(8080);
debug('listening on port 8080');
