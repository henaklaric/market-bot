const requestPromise = require('request-promise');
const config = require('./config.js');

module.exports = function (){
    return {
        getOrderBook: async function () {
            const params = {
                Symbol: "tETHUSD",
                Precision: "P0",
            };
            let url = config.deversifiAPI + "/book/" + params.Symbol + "/" + params.Precision;
            let options = {
                resolveWithFullResponse: true,
                uri: url
            };
            try {
                var res = await requestPromise(options);
            } catch (error) {
               console.log('Could not retrieve Orderbook from ' + url, error.message);
                return [];
            }

            return JSON.parse(res.body);


        }
    }

}
