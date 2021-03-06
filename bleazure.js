'use strict';
// TODO: refactor to separate devices and sensors

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
  DOORSENSOR:   1,
  LIGHTSWITCH:  2,
  properties: {
    1: {name: 'Door sensor',   value: 1},
    2: {name: 'Light switch',  value: 2}
  }
};

// local variables
var sensors;        // List of paired sensors
var config;         // Parameters from Config file
var sensorfilename; // sensor's file name
var isScanning;     // Indicates if we aer scanning for devices
var devicesFound;   // List of devices currently found while scanning
var scanCallback;

// Main class
class Bleazure {

   /**
   * Bleazure constructor takes 2 JSON file names as parameters
   * @param configfilename name of the JSON file containing the parameters below
   *  - sensorServiceUuid
   *  - sensorSubServiceUuid
   *  - sensorCharacteristicUuid
   *  - scanTimeout - time in miliseconds app should stop looking for devices
   * @param _sensorfilename name of the JSON file which will store info about the paired devices and sensors
   */
    constructor (configfilename, _sensorfilename) {
        var contents;

        // Initialize state variables
        sensorfilename = _sensorfilename;
        isScanning = false;
        devicesFound = [];
        
        debug('Reading config file');
        contents = fs.readFileSync(configfilename);
        config = JSON.parse(contents);
        debug (config);

        // Reads paired devices file - assume empty if not found
        debug ('Reading paired devices list');
        try {
            contents = fs.readFileSync(sensorfilename);
            sensors = JSON.parse(contents);
        } catch (err) {
            if (err.code === 'ENOENT') {
                sensors = [];
            } else {
                throw err;
            }
        }
        debug (sensors);

        // Augments sensors array info
        for (var i=0; i<sensors.length; i++) {
            sensors[i].type     = TypeEnum.properties[sensors[i].typeId].name;
            sensors[i].statusId = StatusEnum.DISCONNECTED;
            sensors[i].status   = StatusEnum.properties[sensors[i].statusId].name;
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
   * Returns all sensors found during scanning 
   * @return as an array of objects following the structure below:
   * - id
   * - typeId
   * - type
   */
    getFoundSensors () {
        return devicesFound;
    }
   /**
   * Sets user friendly name for a sensor 
   * @param callback function to be called when a device is found.
   */
    startScanning (callback) {
        if (isScanning) {
            return;
        }
        
        debug ('Started scanning');
        isScanning = true;
        devicesFound = [];
        scanCallback = callback;

        setTimeout(function () {
            isScanning = false;
            devicesFound = [];
            debug ('Stopped scanning');
            // TODO: add code to stop scanning            
        },config.scanTimeout); 

        setTimeout(function () {
            devicesFound = [{id:'00992255-1', typeId:2, type:'Light switch'}];
            scanCallback ();
            setTimeout(function () {
                devicesFound.push ({id:'00992255-2', typeId:2, type:'Light switch'});
                scanCallback ();                
                setTimeout(function () {
                    devicesFound.push ({id:'00992255-3', typeId:2, type:'Light switch'});
                    scanCallback ();                
                },2000);        
            },2000);
        },2000);
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
            saveSensorsFile ();
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

   /**
   * Pairs a sensor 
   * @param id ID of the sensor
   * @param newName Name of the new sensor
   * @return new name if sensor is being paired, null otherwise
   */
    // TODO: Need to review this really a device should be paired, not a sensor
    pairSensor (id, newName) {
        var pos = getSensorPos (id);
        if (pos >= 0) {
            return null;  // Sensor already paired
        }
        // TODO: Need to add real code to scan for device and add all sensors under it
        sensors.push ({
            id: id, 
            name: newName, 
            typeId: TypeEnum.DOORSENSOR, 
            type: TypeEnum.properties[1].name,
            statusId: StatusEnum.CONNECTING,
            status: StatusEnum.properties[2].name
        });
        saveSensorsFile ();
        return newName;
    }

   /**
   * Unpairs a sensor 
   * @param id ID of the sensor
   * @return 1  if sensor is being unpaired, 0 otherwise
   */
    // TODO: Need to review this really a device should be paired, not a sensor
    unpairSensor (id) {
        var pos = getSensorPos (id);
        if (pos >= 0) {
            sensors.splice (pos, 1);
            return 1;  // Sensor already paired
        }
        return 0;
    }
}

/*
 * For internal use: Returns position of a sensor in the list above
 * @param id ID of the sensor
 * @return an integer. Returns -1 if not found.
 */
function getSensorPos (id) {
    for (var i=0; i<sensors.length; i++) {
//            debug ('searching:', sensors[i]);
        if (sensors[i].id == id) {
            return i;
        }
    }
    return -1;
}

/*
 * For internal use: Persists list of sensors in JSON file
 */
function saveSensorsFile () {
    // TODO: No need to save status, statusId or type
    fs.writeFile(sensorfilename,  JSON.stringify(sensors), function (err) {
        if (err) return debug('error saving sensors file:', err);
    });
}

module.exports = Bleazure;
