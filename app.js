var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const Dishes = require('./models/dishes');
const Promotions = require('./models/promotions');
const Leaders = require('./models/leaders');
const url = 'mongodb://localhost:27017/conFusion';

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');

var app = express();

// Server connection
mongoose.connect(url)
.then((db) => {
  console.log("Connected correctly to the server..");
}, (err) => console.log(err))
.catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

// session middleware
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}))

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
    var authHeader = req.headers.authorization;

    if (!authHeader) {
      var err = new Error("You are not authorized user..");
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      next(err); // control pass to the error handler..
      return;
    }
    else {
      var Auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var username = Auth[0];
      var password = Auth[1];

      if (username === 'admin' && password === 'password'){
        req.session.user = 'admin'
        next(); //authorized user
      }
      else{
        err = new Error("You are not authorized user..");
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        next(err); // control pass to the error handler..
        return;
      }
    }
  }
  else {
    if(req.session.user === 'admin') {
      console.log('req.session:', req.session);
      next();
    }
    else {
      err = new Error("You are not authorized user..");
      err.status = 401;
      next(err); // control pass to the error handler..
      return;
    }
  }

}

app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders', leaderRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
