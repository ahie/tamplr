var express        = require('express');
var router         = express.Router();
var models         = require('../models');
var authenticate   = require('../middleware/api_auth.js');
var blogMiddleware = require('../middleware/blog_middleware.js');

router.get('/:id',
blogMiddleware.parseBlog,
function(req, res, next) {

});

router.get('/:id/comments', function(req, res, next) {

});

router.post('/:id/comments', function(req, res, next) {

});

module.exports = router;
