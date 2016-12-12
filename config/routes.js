var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Role = require('../app/controllers/role');
var HolidayType =require('../app/controllers/holidayType');
var Note = require('../app/controllers/note');

module.exports = function(app){

  //pre  handle user
  app.use(function(req, res, next){
    //注意这里逻辑的变化
    var _user = req.session.user;
    app.locals.user = _user;
    next();
  });

  //Index
  app.get('/', Index.index);

  app.get('/holandUser', Index.holandUser);

  //admin


  //User
  app.post('/user/find', User.findOne);


  app.post('/user/new',User.new);

  //Role
  app.post('/role/new',Role.new);

  //HolidayType
  app.post('/holidaytype/new', HolidayType.new);


  //Note
  app.post('/note/new', Note.new);


  //app.post('/user/reqHoliday',Note.reqHoliday);





  app.get('/form-wizard', function (req, res) {
  	res.render('form-wizard', {
  			title: 'form-wizard'
  	});
  });


  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
};
