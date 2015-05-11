var express = require('express');
var router = express.Router();
var passport = require('passport');

var models = require('../models');

router.get('/', function(req, res, next) {
  models.BlogPost
  .findAll({order: 'created DESC', limit: 10})
  .then(function(blogPosts) {
    res.render('index', {
      user: req.user,
      blogPosts: blogPosts
    });
  });
});

router.get('/profile', function(req, res, next) {
  if(!req.user) {
    var err = new Error('Not authorized');
    err.status = 403;
    return next(err);
  } // 404?
  models.User
  .find(req.user)
  .then(function(user) {
    res.render('profile', {
      name: user.name,
      user: req.user
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
