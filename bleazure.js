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
            { name: 'Bloody Mary',  id: '00112233-1', type: 'Door sensor', status: 'Connected' },
            { name: 'Martini',      id: '00112244-1', type: 'Door sensor', status: 'Connected' },
            { name: 'Scotch',       id: '00112255-1', type: 'Door sensor', status: 'Connected' }
        ];
    }

    // Returns all registered sensors
    getAllSensors () {
        return sensors;
    }

    // Returns position of a sensor in the list above. Returns -1 if not found.
    getSensorPos (id) {
        for (var i=0; i<=sensors.length; i++) {
//            debug ('searching:', sensors[i]);
            if (sensors[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    // Sets user friendly name for a sensor
    setSensorName (id, newName) {
        var pos = this.getSensorPos (id);
        if (pos >= 0) {
            sensors[pos].name = newName;
            return newName;
        }
    }

    // returns a sensor given its ID
    getSensorById (id) {
        var pos = this.getSensorPos (id);
        if (pos >= 0) {
//            debug ('returning:', sensors[pos]);
            return (sensors[pos]);
        }
    }
}

module.exports = Bleazure;
