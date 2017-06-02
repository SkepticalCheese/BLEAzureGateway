'use strict';
// TODO: use ID's instead of descriptions for types and status

var noble = require('noble');
var fs = require('fs');

// set DEBUG variable to bleazure to see output on console
var debug = require('debug')('bleazure');

/**
 * Possible statuses
 */
var StatusEnum = {
  CONNECTED:    1,
  DISCONNECTED: 2,
  CONNECTING:   3,
  properties: {
    1: {name: 'Connected',      value: 1},
    2: {name: 'Disconnected',   value: 2},
    3: {name: 'Connecting',     value: 3}
  }
};

/**
 * Device types
 */
var TypeEnum = {
  DOORSENSOR:    1,
  LIGHTSWITCH:  2,
  properties: {
    1: {name: 'Door sensor',   value: 1},
    2: {name: 'Light switch',  value: 2}
  }
};

// local variables
var sensors; // List of paired sensors
var config;  // Parameters from Config file

// Main class
class Bleazure {

   /**
   * Bleazure constructor takes 2 JSON file names as parameters
   * @param configfilename name of the JSON file containing the parameters below
   *  - sensorServiceUuid
   *  - sensorSubServiceUuid
   *  - sensorCharacteristicUuid
   * @param sensorfilename name of the JSON file which will store info about the paired devices and sensors
   */
    constructor (configfilename, sensorfilename) {

        debug('Reading config file');
        config = fs.readFileSync(configfilename);
        debug (config);

        // Reads paired devices file - assume empty if not found
        debug ('Readind paired devices list');
        try {
            sensors = fs.readFileSync(sensorfilename);
        } catch (err) {
            if (err.code === 'ENOENT') {
                sensors = [];
            } else {
                throw err;
            }
        }

        // Augments sensors array
        for (var i=0; i<=sensors.length; i++) {
            sensors[i].type   = TypeEnum.properties[sensors[i].typeId].name;
            sensors[i].status = StatusEnum.properties[sensors[i].statusId].status;
        }       
    }

   /**
   * Returns all registered sensors 
   * @return as an array of objects following the structure below:
   * - name
   * - id
   * - type
   * - status
   */
    getAllSensors () {
        return sensors;
    }

   /**
   * Sets user friendly name for a sensor 
   * @param id ID of the sensor
   * @return new name if sensor ID is found, null otherwise
   */
    setSensorName (id, newName) {
        var pos = getSensorPos (id);
        if (pos >= 0) {
            sensors[pos].name = newName;
            return newName;
        }
    }

   /**
   * Returns a sensor object given its ID 
   * @param id ID of the sensor
   * @return sensor object if sensor ID is found, null otherwise
   */
    getSensorById (id) {
        var pos = getSensorPos (id);
        if (pos >= 0) {
//            debug ('returning:', sensors[pos]);
            return (sensors[pos]);
        }
    }
}

/*
 * For internal use: Returns position of a sensor in the list above
 * @param id ID of the sensor
 * @return an integer. Returns -1 if not found.
 */
function getSensorPos (id) {
    for (var i=0; i<=sensors.length; i++) {
//            debug ('searching:', sensors[i]);
        if (sensors[i].id == id) {
            return i;
        }
    }
    return -1;
}

module.exports = Bleazure;
