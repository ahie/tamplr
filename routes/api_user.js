var express      = require('express');
var router       = express.Router();
var models       = require('../models');
var authenticate = require('../auth/api_auth.js');

router.post('/', function(req, res, next) {

  var username = req.body.username;
  var password = req.body.password;
  var name     = req.body.name;

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
        user.addFollowedBlog(defaultBlog);
    });

    return res.status(201).json(user);

  })
  .catch(function(err) {
    if (err.errors) {
      if (err.errors[0].type === 'unique violation')
        res.status(409);
      else
        res.status(400);
      return res.json({error: 'InvalidInput'});
    }
    return res.status(500).json({error: 'ServerError'});
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
      return res.status(404).json({error: 'UserNotFound'});
    }
  });

});

router.put('/:username', authenticate, function(req, res, next) {

  if (!!req.body.name && !!req.body.password)
    return res.status(404).json({error: 'InvalidInput'});

  var username = req.params.username;

  if (username != req.user.get('username'))
    return res.status(403).json({error: 'NoAccess'});

  var query = {where: {username: username}};

  models.User.find(query).then(function(user) {
    if (user) {
      if (req.body.name)
        user.setDataValue('name', req.body.name);
      if (req.body.password)
        user.setDataValue('password', req.body.password);
      user.save();
      return res.status(200).send();
    }
    else {
      return res.status(404).json({error: 'UserNotFound'});
    }
  });
});

router.get('/:username/blogs', function(req, res, next) {

});

router.get('/:username/follows', function(req, res, next) {

});

router.put('/:username/follows/:id', function(req, res, next) {

});

router.delete('/:username/follows/:id', function(req, res, next) {

});

router.put('/:username/likes/:id', function(req, res, next) {

});

router.delete('/:username/likes/:id', function(req, res, next) {

});

module.exports = router;
