var express      = require('express');
var router       = express.Router();
var models       = require('../models');
var authenticate = require('../auth/api_auth.js');

// middleware
var blogExists = function(req, res, next) {
  models.Blog
  .find(req.params.id)
  .then(function(blog) {
    if (blog) {
      req.blog = blog;
      next();
    }
    else
      res.status(404).json({error: 'NoSuchBlog'});
  });
};

var writePermissions = function(req, res, next) {

  req.blog
  .getAuthors({where: {username: req.user.username}})
  .then(function(authors) {
    console.log(authors);
    if(!authors)
      return res.status(403).json({error: 'NoPermissions'});
    if(req.blog.get('isDefaultBlog'))
      return res.status(403).json({error: 'DefaultBlog'});
    next();
  });

};

var userExists = function(req, res, next) {
  models.User
  .find(req.params.username)
  .then(function(user) {
    if (user) {
      req.userInstance = user;
      next();
    }
    else
      return res.status(404).json({error: 'NoSuchUser'});
  });
};
// end middleware

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
    req.user.addFollowedBlog(blog);
    return res.status(201).json({id: blog.get('id')});
  })
  .catch(function(err) {
    next(new Error('Failed creating new blog'));
  });

});

router.get('/:id', blogExists, function(req, res, next) {

  return res.status(200).json({
    id:   req.blog.get('id'),
    name: req.blog.get('name')
  });

});

router.delete('/:id', 
  authenticate, 
  blogExists, 
  writePermissions, 
  function(req, res, next) {

  req.blog.setAuthors([])
  .then(function() {
    return req.blog.setFollowers([]);
  })
  .then(function() {
    req.blog.destroy();
    return res.status(200).send();
  });

});

router.put('/:id/author/:username',
  authenticate,
  blogExists,
  writePermissions,
  userExists,
  function(req, res, next) {

  req.userInstance
  .addAuthoredBlog(req.blog)
  .then(function() {
    return res.status(200).send();
  });

});

router.delete('/:id/author/:username',
  authenticate,
  blogExists,
  writePermissions,
  userExists,
  function(req, res, next) {

  req.userInstance
  .removeAuthoredBlog(req.blog)
  .then(function() {
    return res.status(200).send();
  });

});

router.get('/:id/posts', blogExists, function(req, res, next) {

  req.blog
  .getBlogPosts({order: 'createdAt DESC', limit: 10})
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
    res.status(200).json(resJSON);
  });

});

router.post('/:id/posts',
  authenticate,
  blogExists,
  writePermissions,
  function(req, res, next) {

  if(!req.body.title || !req.body.text)
    return res.status(400).json({error: 'MissingData'});

  models.BlogPost
  .create({
    title:  req.body.title,
    text:   req.body.text,
    author: req.user.username,
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

router.get('/:id/followers', function(req, res, next) {

});

module.exports = router;
