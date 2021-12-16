var express = require('express');
var router = express.Router();
const portfoliosCtrl = require('../controllers/portfolios');
const isLoggedIn = require('../config/auth');

// POST "/portfolios" - new form route
router.get('/new', portfoliosCtrl.new);
// POST "/portfolios" - Create Route
router.post('/', portfoliosCtrl.create);

//GET "/portfolios", index route
router.get('/', portfoliosCtrl.index);

//GET "/portfolios/:id", show route
router.get('/:id', portfoliosCtrl.show);

module.exports = router;
