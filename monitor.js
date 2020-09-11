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

let myOrders = [];

module.exports = function () {

    return {
        start: async function () {
            // initialize assets, set default values
            assets = {
                ETH: {
                    amount: new BigNumber(config.startingAssets.ETH.amount),
                    // possible improvement "reserved balances"
                },
                USD: {
                    amount: new BigNumber(config.startingAssets.USD.amount),
                }
            };

            // fetch orderbook
            api().getOrderBook().then(async function (orders) {

                //determine best ask and bid prices
                bestPrices = await orderbook().getBestOrderPrices(orders);

                //create 5 bid and 5 ask orders on the market, with random amounts and random prices
                for (let i = 0; i < config.numberOfOrdersPerFiveSeconds; i++) {

                    //get random bid price and amount
                    let randomBidPrice = orderbook().getRandomPrice(bestPrices.bid);
                    let randomBidAmount = orderbook().getRandomAmount(new BigNumber(assets.USD.amount));

                    //update balance
                    assets.USD.amount = assets.USD.amount.minus(randomBidAmount);

                    //save order
                    myOrders.push({
                        type: "bid",
                        price: randomBidPrice,
                        amount: randomBidAmount.dividedBy(randomBidPrice),
                        status: "pending"
                    });

                    //log
                    console.log(strd);
                    console.log("PLACE BID @ PRICE: " + randomBidPrice + ", AMOUNT: " + randomBidAmount.dividedBy(randomBidPrice));

                    // same thing... todo make a function for these steps, so it's not copy-paste
                    let randomAskPrice = orderbook().getRandomPrice(bestPrices.ask);
                    let randomAskAmount = orderbook().getRandomAmount(assets.ETH.amount);

                    assets.ETH.amount = assets.ETH.amount.minus(randomAskAmount);

                    myOrders.push({
                        type: "ask",
                        price: randomAskPrice,
                        amount: randomAskAmount,
                        status: "pending"
                    });

                    console.log(strd);
                    console.log("PLACE ASK @ PRICE: " + randomAskPrice + ", AMOUNT: " + randomAskAmount);
                }

            });

            //refresh orderbook every five seconds
            setInterval(() => {
                api().getOrderBook().then(function (orders) {
                    orderbook().getBestOrderPrices(orders).then(bestPrices => {
                        myOrders.forEach(order => {
                            // bid orders that are above the best bid or sell orders that are below the best ask are marked as "processed"ww
                            if (order.status === "pending" && order.type === "ask" && order.price.isLessThan(bestPrices.ask)) {
                                order.status = "processed";
                                assets.USD.amount = assets.USD.amount.plus(order.amount.multipliedBy(order.price));
                                console.log("FILLED ASK @ PRICE AMOUNT (ETH - " + order.amount.toFixed(8) + " USD + " + order.amount.multipliedBy(order.price).toFixed(2) + ")");
                            } else if (order.status === "pending" && order.type === "bid" && order.price.isGreaterThan(bestPrices.bid)) {
                                order.status = "processed";
                                assets.ETH.amount = assets.ETH.amount.plus(order.amount);
                                console.log("FILLED BID @ PRICE AMOUNT (ETH + " + order.amount.toFixed(8) + " USD - " + order.amount.multipliedBy(order.price).toFixed(2) + ")");
                            }
                        })
                    });

                });

            }, 5000);
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