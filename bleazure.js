'use strict';

// set DEBUG variable to bleazure to see output
var debug = require('debug')('bleazure');

// local variables
var sensors;

// Food is a base class
class Bleazure {

    constructor () {
        debug ('initializing BleAzure');
        sensors = [
            { name: 'Bloody Mary', id: '00112233-1', type: 'Door sensor', status: 'Connected' },
            { name: 'Martini',  id: '00112244-1', type: 'Door sensor', status: 'Connected' },
            { name: 'Scotch',  id: '00112255-1', type: 'Door sensor', status: 'Connected' }
        ];
    }

    getAllSensors () {
        return sensors;
    }

    setSensorName (id, newName) {
        for (var i=0; i<=sensors.len(); i++) {
            if (sensors[i].id == id) {
                sensors[i].name = newName;
                return (newName);
            }
        }
        return;
    }
}

module.exports = Bleazure;
