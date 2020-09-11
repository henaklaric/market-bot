'use strict';
const api = require('./api.js');
const orderbook = require('./orderbook.js');
const config = require('./config.js');
const BigNumber = require('bignumber.js');
const strd = "*************************";

let assets = {
    ETH: {
        amount: new BigNumber(0)
    },
    USD: {
        amount: new BigNumber(0)
    }
};

let bestPrices = {
    bid: new BigNumber(0),
    ask: new BigNumber(0)
}

module.exports = function () {

    return {
        start: async function () {
            // initialize assets, set default values
            assets = {
                ETH: {
                    amount: new BigNumber(config.startingAssets.ETH.amount),
                    reserved: new BigNumber(0)
                },
                USD: {
                    amount: new BigNumber(config.startingAssets.USD.amount),
                    reserved: new BigNumber(0)
                }
            };

            // yeah.. so if things stop working suddenly I would start with this:
            // calls the Orderbook endpoint every 5 seconds, forever
            setInterval(async () => {
                    api().getOrderBook().then(async function (orders) {
                        bestPrices = await orderbook().getBestOrderPrices(orders);
                    });
                }
                , 5000);
        },

        printBalances: function () {
            console.log(strd)
            console.log("ASSET BALANCES");
            console.log("ETH: " + assets.ETH.amount.toFixed(8).toString());
            console.log("USD: " + assets.USD.amount.toFixed(2).toString());
            console.log(strd);
        }

    }
}