var express      = require('express');
var router       = express.Router();
var models       = require('../models');
var authenticate = require('../auth/api_auth.js');

router.get('/:id', function(req, res, next) {

});

router.get('/:id/comments', function(req, res, next) {

});

router.post('/:id/comments', function(req, res, next) {

});

module.exports = router;
