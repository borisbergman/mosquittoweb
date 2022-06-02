#!/usr/bin/env nodejs

const express = require('express')
const config = require('config');

const app = express()
const mqtt = require('mqtt')
const mosquittopw = config.get('password');
const mosquittouser = config.get('username');

const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

const host = 'wss://boriscornelisbergman.nl:8083'

const options = {
  keepalive: 30,
  clientId: clientId,
  username: mosquittouser,
  password: mosquittopw,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
}

console.log('connecting mqtt client')
const client = mqtt.connect(host, options)

client.on('error', function (err) {
  console.log(err)
  client.end()
})

client.on('connect', function () {
  console.log('client connected:' + clientId)
})

client.on('message', function (topic, message, packet) {
  console.log('Received Message:= ' + message.toString() + '\nOn topic:= ' + topic)
})

client.on('close', function () {
  console.log(clientId + ' disconnected')
})

app.use(express.static('public'))
app.use(express.json()); 

app.route('/solenoid/')
  .post(function (req, res, next) {
    res.send({'opened': req.body.solenoidid} );
    client.publish('/wagenweg/planten', req.body.solenoidid.toString())            
  });

app.listen(3000)