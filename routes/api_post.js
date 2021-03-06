var express        = require('express');
var router         = express.Router();
var models         = require('../models');
var authenticate   = require('../middleware/api_auth.js');
var blogMiddleware = require('../middleware/blog_middleware.js');

router.get('/:id',
blogMiddleware.parseBlogPost,
function(req, res, next) {

  req.blogPost.countLikes(function(numLikes) {
    return res.status(200)
    .json({
      title: req.blogPost.get('title'),
      text: req.blogPost.get('text'),
      author: req.blogPost.get('author'),
      likes: numLikes
    });
  });

});

router.get('/:id/comments',
blogMiddleware.parseBlogPost,
function(req, res, next) {

  req.blogPost
  .getComments({order: 'created DESC', limit: 10})
  .then(function(comments) {
    var resJSON = [];
    comments.forEach(function(comment) {
      resJSON.push({
        id: comment.get('id'),
        text: comment.get('text'),
        author: comment.get('author')
      });
    });
    return res.status(200).json(resJSON);
  });

});

// Same as above, without limit
router.get('/:id/comments/all',
blogMiddleware.parseBlogPost,
function(req, res, next) {

  req.blogPost
  .getComments({order: 'created DESC'})
  .then(function(comments) {
    var resJSON = [];
    comments.forEach(function(comment) {
      resJSON.push({
        id: comment.get('id'),
        text: comment.get('text'),
        author: comment.get('author')
      });
    });
    return res.status(200).json(resJSON);
  });

});

router.get('/:id/comments/count',
blogMiddleware.parseBlogPost,
function(req, res, next) {

  req.blogPost
  .getComments()
  .then(function(comments) {
    return res.status(200).json({comments: comments.length});
  });

})

router.post('/:id/comments',
authenticate,
blogMiddleware.parseBlogPost,
function(req, res, next) {

  if (!req.body.text)
    return res.status(400).json({error: 'MissingText'});

  models.Comment
  .create({ author: req.user.username, text: req.body.text })
  .then(function(comment) {
    req.blogPost.addComment(comment)
    .then(function() {
      return res.status(201).json({id: comment.get('id')});
    });
  });

});

router.get('/:id/likes/count',
blogMiddleware.parseBlogPost,
function(req, res, next) {

  req.blogPost
  .getUserLikes()
  .then(function(likes) {
    return res.status(200).json({likes: likes.length});
  });

})

module.exports = router;
