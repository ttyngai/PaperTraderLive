const Stock = require('../models/stock');
const Portfolio = require('../models/portfolio');
const StockPrice = require('../stockPrice');
module.exports = {
  index,
  show,
  create,
  delete: deleteOne,
};

async function index(req, res) {
  // pass in array of tickers
  let tickers = [];
  Stock.find({ user: req.user }, async function (err, stocksFound) {
    stocksFound.forEach(function (s) {
      tickers.push(s.ticker);
    });
    stocksToRender = stocksFound;
    const stocks = await StockPrice.getStock(tickers, stocksFound);
    res.render('stocks/index', { title: 'stocks', stocks });
  });
}

async function deleteOne(req, res) {
  await Stock.findOne({ _id: req.params.id }).then(function (stock) {
    stock.remove();
    res.redirect('/stocks');
  });
}

function show(req, res) {
  Stock.findById(req.params.id, function (err, stock) {
    Portfolio.find({ user: req.user._id }, function (err, portfolios) {
      res.render('stocks/show', { title: 'Stock Details', stock, portfolios });
    });
  });
}
async function create(req, res) {
  // Check stock exist
  const check = await StockPrice.checkStock(req.body.ticker);
  // Check stock duplicate

  const duplicate = await Stock.findOne({
    $and: [{ ticker: req.body.ticker }, { user: req.user._id }],
  });

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
}
