var express = require('express');
var router = express.Router();
var passport = require('passport');

var models = require('../models');

router.get('/', function(req, res, next) {

  var renderVars = {};

  models.BlogPost
  .findAll({order: 'created DESC', limit: 10})
  .then(function(blogPosts) {

    renderVars.blogPosts = blogPosts;
    if (!req.user) return res.render('index', renderVars);

    renderVars.user = req.user;
    req.user.getAuthoredBlogs()
    .then(function(authoredBlogs) {

      renderVars.authoredBlogs = authoredBlogs;
      req.user.getFollowedBlogs()
      .then(function(followedBlogs) {

        renderVars.followedBlogs = followedBlogs;
        console.log(renderVars);
        res.render('index', renderVars);

      });

    });

  })

});

router.get('/profile', function(req, res, next) {
  if(!req.user) {
    var err = new Error('Not authorized');
    err.status = 403;
    return next(err);
  }
  models.User
  .find(req.user)
  .then(function(user) {
    res.render('profile', {
      name: user.name,
      user: req.user
    });
  });
});

router.get('/blogpost/:id', function(req, res, next) {

  var blogp;
  models.BlogPost
  .find(req.params.id)
  .then(function(blogPost) {
    if(!blogPost) {
      var err = new Error('Blog post not found');
      err.status = 404;
      return next(err);
    }
    blogp = blogPost;
    return blogPost.getUserLikes();
  })
  .then(function(userLikes) {
    if(!req.user) {
     res.render('blogpost', {
        blogPost: blogp,
        likes: userLikes.length
      });
    }
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
