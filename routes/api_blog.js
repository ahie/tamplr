var express        = require('express');
var router         = express.Router();
var models         = require('../models');
var authenticate   = require('../middleware/api_auth.js');
var blogMiddleware = require('../middleware/blog_middleware.js');

var parseBlog = blogMiddleware.parseBlog;
var checkUserPermissions = blogMiddleware.checkUserPermissions; 
var parseUser = blogMiddleware.parseUser; 

router.post('/', authenticate, function(req, res, next) {

  if (!req.body.name)
    return res.status(400).json({error: 'MissingName'});

  models.Blog.count()
  .then(function(count) {
    return models.Blog.create({
      id:   count,
      name: req.body.name
    }) 
  })
  .then(function(blog) {
    req.user.addAuthoredBlog(blog);
    return res.status(201).json({id: blog.get('id')});
  })
  .catch(function(err) {
    return res.status(500).end();
  });

});

router.get('/:id', parseBlog, function(req, res, next) {

  return res.status(200).json({
    id:   req.blog.get('id'),
    name: req.blog.get('name')
  });

});

router.delete('/:id',
authenticate,
parseBlog,
checkUserPermissions,
function(req, res, next) {

  req.blog.setAuthors([])
  .then(function() {
    return req.blog.setFollowers([]);
  })
  .then(function() {
    req.blog.destroy();
    return res.status(200).end();
  });

});

router.put('/:id/author/:username',
authenticate,
parseBlog,
checkUserPermissions,
parseUser,
function(req, res, next) {

  req.userInstance
  .addAuthoredBlog(req.blog)
  .then(function() {
    return res.status(200).end();
  });

});

router.delete('/:id/author/:username',
authenticate,
parseBlog,
checkUserPermissions,
parseUser,
function(req, res, next) {

  req.userInstance
  .removeAuthoredBlog(req.blog)
  .then(function() {
    return res.status(200).end();
  });

});

router.get('/:id/posts', parseBlog, function(req, res, next) {

  req.blog
  .getBlogPosts({order: 'created DESC', limit: 10})
  .then(function(posts) {
    var resJSON = [];
    posts.forEach(function(post) {
      resJSON.push({
        id:     post.get('id'),
        title:  post.get('title'),
        text:   post.get('text'),
        author: post.get('author')
      });
    });
    return res.status(200).json(resJSON);
  });

});

router.post('/:id/posts',
authenticate,
parseBlog,
checkUserPermissions,
function(req, res, next) {

  if(!req.body.title || !req.body.text)
    return res.status(400).json({error: 'MissingData'});

  models.BlogPost
  .create({
    title:  req.body.title,
    text:   req.body.text,
    author: req.user.username,
    inBlog: req.blog.get('name')
  })
  .then(function(blogPost) {
    req.blog.addBlogPost(blogPost)
    .then(function() {
      return res.status(201).json({id: blogPost.get('id')});
    });
  })
  .catch(function(err) {
    next(new Error('Failed creating new blog post'));
  });

});

router.get('/:id/followers', parseBlog, function(req, res, next) {

  req.blog.getFollowers()
  .then(function(followers) {
    var resJSON = [];
    followers.forEach(function(follower) {
      resJSON.push({username: follower.get('username')});
    });
    return res.status(200).json(resJSON);
  });

});

module.exports = router;
