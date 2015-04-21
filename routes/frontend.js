var express = require('express');
var router = express.Router();
var passport = require('passport');

var models = require('../models');

router.get('/', function(req, res, next) {
  models.User.findAll().then(function(users) {
    res.render('index', {
      user: req.user,
      host: req.headers.host,
      users: users
    });
  });
});

router.get('/signin', function(req, res, next) {
  if (req.user)
    req.logout();
  res.render('signin');
});

router.get('/signup', function(req, res, next) {
  if (req.user)
    req.logout();
  res.render('signup');
});

router.post('/login',
passport.authenticate('local',
  { successRedirect: '/',
    failureRedirect: '/signin' 
  })
);

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
