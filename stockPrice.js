const fetch = require('node-fetch');

module.exports = {
  getStock,
  checkStock,
};

async function getStock(array, stocksFound) {
  let tickers = array.toString();
  let stocks = [];
  if (tickers.length !== 0) {
    // if there is a username, we will make a request!
    await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${tickers}`
    )
      .then((res) => res.json())
      .then((quote) => {
        quote.quoteResponse.result.forEach(function (s, idx) {
          let stockInfo = {
            ticker: s.symbol,
            bid: s.bid,
            ask: s.ask,
            open: s.regularMarketOpen,
            change: s.regularMarketChangePercent,
            _id: stocksFound[idx]._id,
          };
          stocks.push(stockInfo);
        });
      });
  }

  return stocks;
}

async function checkStock(ticker) {
  let exist;
  await fetch(
    `https://query1.finance.yahoo.com/v7/finance/quote?lang=en-US&region=US&corsDomain=finance.yahoo.com&symbols=${ticker}`
  )
    .then((res) => res.json())
    .then((quote) => (exist = quote.quoteResponse.result[0].bid));
  return exist;
}
