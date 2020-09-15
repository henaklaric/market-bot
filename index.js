'use strict';
const express = require('express');
const monitor = require('./monitor.js');
const config = require('./config.js');
const cron = require('node-cron');

let app = express();

app.listen(config.port, function () {
    console.log('App started on port ' + config.port);
});

// start monitoring market, initialize assets
monitor().start();

// shows overall asset balances every 30 seconds
cron.schedule('* * * * *', () => {

    monitor().printBalances();

    // sleep 30 seconds
    setTimeout(monitor().printBalances, 30000);
});


