'use strict'
const BigNumber = require('bignumber.js');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function randomFloatInRange(min, max) {
    return Math.random() * (max - min) + min;
}

function randomBool() {
    return Math.random() >= 0.5;
}

module.exports = function () {

    return {

        // after consulting with this great webpage called Google, I realized I made a mistake
        // if by any chance calculating a mean price was a way to solve this problem, and I deleted it, it would be a shame
        // :)
        getMeanOrderPrices: async function (orders) {

            let askNo = 0;
            let bidNo = 0;
            let sumAsk = new BigNumber(0);
            let sumBid = new BigNumber(0);

            await asyncForEach(orders, order => {
                if (BigNumber(order[1]).isGreaterThan(0)) {
                    sumBid = sumBid.plus(order[1]);
                    bidNo++;
                } else {
                    sumAsk = sumAsk.plus(order[1]);
                    askNo++;
                }
            });

            return {
                ask: sumAsk.dividedBy(askNo),
                bid: sumBid.dividedBy(bidNo)
            }
        },

        // get best bid and best ask price
        // Logic:
        // The order with lowest price among the "sellorders" is the Ask.
        // The order with the highest price among the "buyorders" is the Bid.
        getBestOrderPrices: async function (orders) {
            let bestBid = new BigNumber(0);
            let bestAsk = undefined;

            await asyncForEach(orders, order => {
                if (new BigNumber(order[2]).isGreaterThan(0) && new BigNumber(order[0]).isGreaterThan(bestBid)) {
                    bestBid = new BigNumber(order[0]);
                } else if (new BigNumber(order[2]).isLessThan(0) && (new BigNumber(order[0]).isLessThan(bestAsk) || bestAsk === undefined)) {
                    bestAsk = new BigNumber(order[0]);
                }
            });

            return {
                ask: bestAsk,
                bid: bestBid
            }
        },

        getRandomPrice: function (price) {
            let randomPercentage = new BigNumber(randomFloatInRange(0, 0.05)); // get random number from 0 to 0.05 eg. 0% to 5%
            // randomBool() determines if the price will be increased or decreased, 50% chance for both
            return randomBool() ? price.minus(price.multipliedBy(randomPercentage)) : price.plus(price.multipliedBy(randomPercentage));
        },

        getRandomAmount: function (max) {
            return new BigNumber(randomNumber(max));
        }
    }
}

