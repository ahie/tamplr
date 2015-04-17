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
      res.status(404).json({error: 'NoSuchBlog'});
  });
};

exports.checkUserPermissions = function(req, res, next) {

  req.blog
  .hasAuthor(req.user)
  .then(function(result) {
    if(!result)
      return res.status(403).json({error: 'NoPermissions'});
    if(req.blog.get('isDefaultBlog'))
      return res.status(403).json({error: 'DefaultBlog'});
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
      return res.status(404).json({error: 'NoSuchUser'});
  });
};
