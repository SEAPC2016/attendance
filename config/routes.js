var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Role = require('../app/controllers/role');
var HolidayType =require('../app/controllers/holidayType');
var Note = require('../app/controllers/note');


module.exports = function(app){



  //Index
  app.get('/', Index.index);

  //User
  app.get('/userlist', User.userlist);

  // in postman:
  // Headers, Content-Type application/json
  // Body raw
  // {"user":{"userName":"stuff1","userPwd":"123456","userRole":"58492926f210182bbc287137"}}
  app.post('/user/new',User.new);

  //Role
  // {"role":{"roleName":"员工"}}
  app.post('/role/new',Role.new);

  //HolidayType
  // {"holidayType":{"holidayName":"年假","holidayLength":5}}
  app.post('/holidaytype/new', HolidayType.new);

  // {"note":{"userObject":"5849349cf210182bbc28713b","htObject":"584938c2f210182bbc287143","timelength":3}}
  app.post('/note/new', Note.new);

  // in postman, get cannot have body
  // localhost:3000/notes/58493581f210182bbc28713f
  app.get('/notes/:managerId', Note.findNotesByManagerId);

  // {"managerId":"58493581f210182bbc28713f","noteId":"58493eabd5d47f3948fe85ba","approved":true}
  app.post('/notes', Note.updateStateByManager);

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

    console.log('err' + err);

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
};
