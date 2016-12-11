var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var mongoose = require('mongoose');

// Use bluebird Promise, see http://mongoosejs.com/docs/promises.html
mongoose.Promise = require('bluebird');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));


require('./config/routes')(app);
// view engine setup
app.set('views', path.join(__dirname, './app/views/pages'));
app.set('view engine', 'jade');




app.use(express.static(path.join(__dirname, './app/views/public')));

var dbUrl = 'mongodb://100.100.100.10/attendance';
//连接本地数据库
mongoose.connect(dbUrl);

module.exports = app;
