var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Role = require('../app/controllers/role');
var HolidayType =require('../app/controllers/holidayType');


module.exports = function(app){



  //Index
  app.get('/', Index.index);

  //User
  app.get('/userlist', User.userlist);

  app.post('/user/new',User.new);

  //Role
  app.post('/role/new',Role.new);

  //HolidayType
  app.post('/holidaytype/new', HolidayType.new);


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
