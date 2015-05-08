var express        = require('express');
var router         = express.Router();
var models         = require('../models');
var authenticate   = require('../middleware/api_auth.js');
var blogMiddleware = require('../middleware/blog_middleware.js');

var parseUser     = blogMiddleware.parseUser;
var parseBlog     = blogMiddleware.parseBlog;
var parseBlogPost = blogMiddleware.parseBlogPost;

router.post('/', function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  var name     = req.body.name;

  if (!username || !password || !name)
    return res.status(400).json({error: 'Invalid input'});

  models.User
    .create({
      username: username,
      password: password,
      name: name
  })
  .then(function(user) {

    models.Blog
      .create({id: username, name: name + ' default blog', isDefaultBlog: true})
      .then(function(defaultBlog) {
        user.setDefaultBlog(defaultBlog);
        user.addAuthoredBlog(defaultBlog);
    });

    return res.status(201).json();

  })
  .catch(function(err) {
    if (err.errors) {
      var resJSON;
      if (err.errors[0].type === 'unique violation') {
        res.status(409);
        resJSON = {error: 'Username has already been taken'};
      }
      else {
        res.status(400);
        resJSON = {error: 'Invalid input'};
      }
      return res.json(resJSON);
    }
    console.error(err);
    return res.status(500).json({error: 'Server error'});
  });
});


router.get('/:username', function(req, res, next) {

  var username = req.params['username'];
  var query = {where: {username: username}};

  models.User.findOne(query).then(function(user) {
    if (user) {
      return res.json({ username: user.username, name: user.name });
    }
    else {
      return res.status(404).json({error: 'User not found'});
    }
  });

});

router.put('/:username', authenticate, function(req, res, next) {

  if (!!req.body.name && !!req.body.password)
    return res.status(404).json({error: 'Invalid input'});

  var username = req.params.username;

  if (username != req.user.get('username'))
    return res.status(403).json({error: 'No access'});

  var query = {where: {username: username}};

  models.User.find(query).then(function(user) {
    if (user) {
      if (req.body.name)
        user.setDataValue('name', req.body.name);
      if (req.body.password)
        user.setDataValue('password', req.body.password);
      user.save();
      return res.status(200).end();
    }
    else {
      return res.status(404).json({error: 'User not found'});
    }
  });
});

router.get('/:username/blogs', function(req, res, next) {
  models.User.find(req.params.username)
  .then(function(user) {
    if (user)
      return user.getAuthoredBlogs();
    else
      return res.status(404).end();
  })
  .then(function(authoredBlogs) {
    var resJSON = [];
    authoredBlogs.forEach(function(blog) {
      resJSON.push({id: blog.get('id')});
    });
    return res.status(200).json(resJSON);
  });
});

router.get('/:username/follows', parseUser, function(req, res, next) {

  req.userInstance.getFollowedBlogs()
  .then(function(blogs) {
    var resJSON = [];
    blogs.forEach(function(blog) {
      resJSON.push({id: blog.get('id')});
    });
    return res.status(200).json(resJSON);
  });

});

router.put('/:username/follows/:id',
authenticate,
parseBlog,
parseUser,
function(req, res, next) {

  if (req.userInstance.username !== req.user.username)
    return res.status(403).end();

  req.userInstance.addFollowedBlog(req.blog);
  res.status(200).end();

});

router.delete('/:username/follows/:id',
authenticate,
parseBlog,
parseUser,
function(req, res, next) {

  if (req.userInstance.username !== req.user.username)
    return res.status(403).end();

  req.userInstance
  .removeFollowedBlog(req.blog)
  .then(function() {
    res.status(200).end();
  });

});

router.put('/:username/likes/:id',
authenticate,
parseBlogPost,
parseUser,
function(req, res, next) {

  if (req.userInstance.username !== req.user.username)
    return res.status(403).end();

  req.userInstance
  .addLikedBlogPost(req.blogPost)
  .then(function() {
    return res.status(200).end();
  });

});

router.delete('/:username/likes/:id',
authenticate,
parseBlogPost,
parseUser,
function(req, res, next) {

  if (req.userInstance.username !== req.user.username)
    return res.status(403).end();

  req.userInstance
  .removeLikedBlogPost(req.blogPost)
  .then(function() {
    return res.status(200).end();
  });

});

module.exports = router;
