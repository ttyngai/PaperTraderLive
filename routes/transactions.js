var express = require('express');
var router = express.Router();
const transactionsCtrl = require('../controllers/transactions');

// Post transactions
router.post('/stocks/:id/transactions', transactionsCtrl.create);

// Delete transactions
router.delete('/transactions/:id/:portfolioId', transactionsCtrl.delete);

module.exports = router;
