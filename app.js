var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var models = require('./models');

var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;

var frontend = require('./routes/frontend');
var apiHt = require('./routes/api_ht');
var apiUser = require('./routes/api_user');
var apiBlog = require('./routes/api_blog');
var apiPost = require('./routes/api_post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new BasicStrategy(
  { realm: "tamplr" },
  function(username, password, done) {
    models.User
    .find({where: { username: username }})
    .then(function(user) {
      if (!user)
        return done(null, false);
      if (!user.validPassword(password))
        return done(null, false);
      return done(null, user);
    });
  })
);

passport.use(new LocalStrategy(
  function(username, password, done) {
    models.User
    .find({where: {username: username}})
    .then(function(user) {
      if(!user)
        return done(null, false);
      if(!user.validPassword(password))
        return done(null, false);
      return done(null, user);
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.get('username'));
});

passport.deserializeUser(function(id, done) {
  models.User
  .find(id)
  .then(function(user) {
    done(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use('/', frontend);
app.use('/api/ht', apiHt);
app.use('/api/user', apiUser);
app.use('/api/blog', apiBlog);
app.use('/api/post', apiPost);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
