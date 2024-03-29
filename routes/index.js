var express = require('express');
var router = express.Router();
const passport = require('passport');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Home', req });
});

// Google OAuth login
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//Google OAuth callback route
router.get(
  '/oauth2callback',
  passport.authenticate('google', {
    successRedirect: '/stocks',
    failureRedirect: '/',
  })
);

// OAuth logout route
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
