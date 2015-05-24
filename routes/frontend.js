var express = require('express');
var router = express.Router();
var passport = require('passport');
var authenticate   = require('../middleware/api_auth.js');

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
        res.render('index', renderVars);

      });

    });

  })

});

router.get('/profile', 
authenticate,
function(req, res, next) {

  res.render('profile', { user: req.user });

});

router.get('/blogpost/:id', function(req, res, next) {

  models.BlogPost
  .find(req.params.id)
  .then(function(blogPost) {

    blogPost.getBlog()
    .then(function(blog) {
      res.render('blogpost', {
        postId: req.params.id,
        blog: blog,
        user: req.user 
      });

    });

  });

});

router.get('/blog/:id', function(req, res, next) {

  models.Blog
  .find(req.params.id)
  .then(function(blog) {
    if (req.user) {
      blog.hasAuthor(req.user)
      .then(function(result) {
        res.render('blog', {
          authorized: result,
          user: req.user,
          blog: blog
        });
      });
    }
    else {
      res.render('blog', {
        blog: blog
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
