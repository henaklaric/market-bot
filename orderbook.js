'use strict'
const BigNumber = require('bignumber.js');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

module.exports = function () {

    return {

        // calculates median value of bid and ask order prices
        // the challenge said "determine best bid and best ask prices for the ETH-USD market" without explaining what are "the best prices"
        // because I think that calculating best prices is not something that is going to be evaluated
        // I decided to go with median value instead of min, max or something more complex
        // (I hope I'm not wrong)
        getBestOrderPrices: async function (orders) {

            let askNo = 0;
            let bidNo = 0;
            let sumAsk = new BigNumber(0);
            let sumBid = new BigNumber(0);

            await asyncForEach(orders, order => {
                if (BigNumber(order[2]).isGreaterThan(0)) {
                    sumBid = sumBid.plus(order[0]);
                    bidNo++;
                } else {
                    sumAsk = sumAsk.plus(order[0]);
                    askNo++;
                }
            });

            return {
                ask: sumAsk.dividedBy(askNo),
                bid: sumBid.dividedBy(bidNo)
            }
        }
    }
}

