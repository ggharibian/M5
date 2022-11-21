// based on the example on https://www.npmjs.com/package/@abandonware/noble

// const noble = require('@abandonware/noble');

const { copyFileSync } = require('fs');
var http = require('http')

let sensorValue = ''

// noble.on('stateChange', async (state) => {
//     if (state === 'poweredOn') {
//         console.log("start scanning")
//         await noble.startScanningAsync([uuid_service], false);
//     }
// });

// noble.on('discover', async (peripheral) => {
//     await noble.stopScanningAsync();
//     await peripheral.connectAsync();
//     const {
//         characteristics
//     } = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], [uuid_value]);
//     readData(characteristics[0])
// });

const ardu_host = "http://192.168.4.1/";

//
// read data periodically
//
let readData = (host) => {
    req = http.get(host, (res) => {
        res.on('data', (info) => {
            sensorValue += info;
        })
        res.on('end', () => {
            json_sensor_value = JSON.parse(sensorValue);
            console.log(json_sensor_value);
            sensorValue = "";
        })
    });

    req.on('error', () => {
        json_sensor_value = JSON.parse('{"ax":0,"bx":0,"cx":0}');
        console.log(json_sensor_value);
    });

    setTimeout(() => {
        readData(host)
    }, 50);
}

readData(ardu_host);

// hosting a web-based front-end and respond requests with sensor data
// based on example code on https://expressjs.com/

const express = require('express')
const { read } = require('fs')
const path = require('path')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(json_sensor_value))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})