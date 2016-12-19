var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');

//https://www.npmjs.com/package/connect-mongo
var mongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var app = express();

app.locals.moment = require('moment');
var dbUrl = 'mongodb://localhost/attendance';
//var dbUrl = 'mongodb://demo.tjuwork.win/attendance';

// Use bluebird Promise, see http://mongoosejs.com/docs/promises.html
mongoose.Promise = require('bluebird');
//连接本地数据库
mongoose.connect(dbUrl);


  // view engine setup
app.set('views', path.join(__dirname, './app/views/pages'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname,'./app/public')));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(logger(':method :url'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'bruce',
  Store: new mongoStore({
    url:dbUrl,
    collection: 'sessions'
  }),
  resave: true,
  saveUninitialized:true
}));
app.use(bodyParser.urlencoded({ extended: true }));


require('./config/routes')(app);


module.exports = app;
