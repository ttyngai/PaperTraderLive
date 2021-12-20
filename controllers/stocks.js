const Stock = require('../models/stock');
const Portfolio = require('../models/portfolio');
const StockPrice = require('../stockPrice');
const Chart = require('chart.js');
module.exports = {
  index,
  show,
  create,
  hide,
};

async function index(req, res) {
  // pass in array of tickers
  let tickers = [];
  Stock.find({ user: req.user }, async function (err, stocksFound) {
    // Sort alphabetically
    let sortedStocks = [];
    stocksFound.sort(function (a, b) {
      if (a.ticker > b.ticker) return 1;
      if (a.ticker < b.ticker) return -1;
    });
    // push to single ticker
    stocksFound.forEach(function (s) {
      tickers.push(s.ticker);
    });
    // Check if all are hidden(empty), allow watchlist to show "No symbols added"
    let listNotEmpty = false;
    stocksFound.forEach(function (s) {
      if (!s.hide) {
        listNotEmpty = true;
      }
    });

    const stocks = await StockPrice.getStock(tickers, stocksFound);
    res.render('stocks/index', { title: 'Stocks', stocks, listNotEmpty, req });
  });
}

function hide(req, res) {
  Stock.findById(req.params.id, function (err, stock) {
    stock.hide = true;
    stock.save();
    res.redirect('/stocks');
  });
}

function show(req, res) {
  // Charts

  // charts end

  Stock.findById(req.params.id, function (err, stock) {
    //Protect route unless from logged in user
    if (!stock.user.equals(req.user._id)) {
      return res.redirect('/stocks');
    }
    Portfolio.find({ user: req.user._id }, async function (err, portfolios) {
      const quote = await StockPrice.getOneStock(stock.ticker);
      res.render('stocks/show', {
        title: 'Stocks',
        stock,
        portfolios,
        quote,
        req,
      });
    });
  });
}
async function create(req, res) {
  req.body.ticker = req.body.ticker.toUpperCase();
  // Check stock exist
  const check = await StockPrice.checkStock(req.body.ticker);
  // Check stock duplicate
  const duplicate = await Stock.findOne({
    $and: [{ ticker: req.body.ticker }, { user: req.user._id }],
  }).catch((err) => console.log('Duplicate Error', err));

  if (check && !duplicate) {
    const stock = new Stock(req.body);
    stock.user = req.user._id;
    stock.save(function (err) {
      if (err) {
        console.log(err);
        return res.redirect('/stocks');
      }
      res.redirect(`/stocks`);
    });
  }

  if (duplicate) {
    Stock.findOne(
      {
        $and: [{ ticker: req.body.ticker }, { user: req.user._id }],
      },
      function (err, stock) {
        stock.hide = false;
        stock.save();
        res.redirect(`/stocks`);
      }
    );
  }
}
