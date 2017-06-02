'use strict';

var noble = require('noble');
var fs = require('fs');

// set DEBUG variable to bleazure to see output
var debug = require('debug')('bleazure');

// local variables
var sensors; // List of paired sensors
var config;  // Parameters from Config file

// Food is a base class
class Bleazure {

    constructor (configfilename, devicefilename) {

        // *** Config file should contain the entries below
        // - sensorServiceUuid
        // - sensorSubServiceUuid
        // - sensorCharacteristicUuid

        debug('Reading config file');
        config = fs.readFileSync(configfilename);

        // Reads paired devices file - assume empty if not found
        debug ('Readind paired devices list');
        try {
            sensors = fs.readFileSync(devicefilename);
        } catch (err) {
            if (err.code === 'ENOENT') {
                sensors = [];
            } else {
                throw err;
            }
        }
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
