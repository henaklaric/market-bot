'use strict';
require('dotenv').config();

// app configuration, assets
const config = {

    port: process.env.PORT || 3000,
    // sslPort: process.env.SSL_PORT || 8443,

    // deversifi api uri
    deversifiAPI: process.env.DEVERSIFI_API + process.env.DEVERSIFI_API_VERSION,

    // amounts assigned to the bot when app starts
    startingAssets: {
        ETH: {
            amount: process.env.START_ETH_BALANCE || 0
        },
        USD: {
            amount: process.env.START_USD_BALANCE || 0
        }
    },

    numberOfOrdersPerFiveSeconds: process.env.ORDERS_TO_MAKE_EVERY_5_SECONDS || 5

};

module.exports = config;
