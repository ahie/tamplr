var models = require('../models');

exports.parseBlog = function(req, res, next) {
  models.Blog
  .find(req.params.id)
  .then(function(blog) {
    if (blog) {
      req.blog = blog;
      next();
    }
    else
      res.status(404).json({error: 'No such blog exists'});
  });
};

exports.checkUserPermissions = function(req, res, next) {

  req.blog
  .hasAuthor(req.user)
  .then(function(result) {
    if(!result)
      return res.status(403).json({error: 'You do not have permission to alter this blog'});
    if(req.blog.get('isDefaultBlog'))
      return res.status(403).json({error: 'Default blog can not be altered'});
    next();
  });

};

exports.parseUser = function(req, res, next) {
  models.User
  .find(req.params.username)
  .then(function(user) {
    if (user) {
      req.userInstance = user;
      next();
    }
    else
      return res.status(404).json({error: 'No such user exists'});
  });
};

exports.parseBlogPost = function(req, res, next) {
  models.BlogPost
  .find(req.params.id)
  .then(function(blogPost) {
    if (blogPost) {
      req.blogPost = blogPost;
      next();
    }
    else
      return res.status(404).json({error: 'No such blog exists'});
  });
};
