var express      = require('express');
var router       = express.Router();
var models       = require('../models');
var authenticate = require('../auth/api_auth.js');

router.post('/', authenticate, function(req, res, next) {

  if (!req.body.name)
    return res.status(400).json({error: 'MissingName'});

  var name = req.body.name;
  models.Blog.count()
  .then(function(count) {
    return models.Blog.create({
      id: count,
      name: name
    }) 
  })
  .then(function(blog) {
    req.user.addAuthoredBlog(blog);
    req.user.addFollowedBlog(blog);
    return res.status(201).json({id: blog.get('id')});
  })
  .catch(function(err) {
    return res.status(500).json({error: 'ServerError'});
  });
});

router.get('/:id', function(req, res, next) {

  models.Blog
  .find(req.params.id)
  .then(function(blog) {
    if(blog)
      res.status(200).json({id: blog.get('id'), name: blog.get('name')});
    else
      res.status(404).json({error: 'NoSuchBlog'});
  });

});

router.delete('/:id', authenticate, function(req, res, next) {

  models.Blog.find(req.params.id)
  .then(function(blog) {
    if (blog) {
      if (blog.get('isDefaultBlog'))
        return res.status(403).json({error: 'DefaultBlog'});
      return blog.getAuthors();
    }
    else
      return res.status(404).json({error: 'NoSuchBlog'});
  })
  .then(function(authors) {
    console.log(authors);
  });

});

router.put('/:id/author/:username', function(req, res, next) {

});

router.delete('/:id/author/:username', function(req, res, next) {

});

router.get('/:id/posts', function(req, res, next) {

});

router.post('/:id/posts', function(req, res, next) {

});

router.get('/:id/followers', function(req, res, next) {

});

module.exports = router;
