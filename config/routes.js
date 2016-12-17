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
    //console.log(_user);
    app.locals.user = _user;
    next();
  });

  //Index
  app.get('/', Index.index);

  app.get('/holandUser', Index.holandUser);

  //admin


  //User
  app.post('/user/find', User.findOne);


  app.get('/user/findUserInfo', User.findUserInfo);

  app.post('/user/update', User.updateUserInfo);


  // in postman:
  // Headers, Content-Type application/json
  // Body raw
  // {"user":{"userName":"stuff1","userPwd":"123456","userRole":"58492926f210182bbc287137"}}
  app.post('/user/new',User.new);

  //signin
  app.post('/user/signin', User.signin);
  //Role
  // {"role":{"roleName":"员工"}}
  app.post('/role/new',Role.new);

  //HolidayType
  // {"holidayType":{"holidayName":"年假","holidayLength":5}}
  app.post('/holidaytype/new', HolidayType.new);

  // {"note":{"userObject":"5849349cf210182bbc28713b","htObject":"584938c2f210182bbc287143","timelength":3}}
  app.post('/note/new', Note.new);

  app.get('/notes/manager', Note.findManagerCanHandleNotes);

  // {"noteId":"58493eabd5d47f3948fe85ba","approved":true}, managerId can be found from session
  app.post('/notes/manager', Note.updateStateByManager);

  //app.post('/user/reqHoliday',Note.reqHoliday);

  //最新假期状态
  app.get('/note/reqLatestState', Note.reqLatestState);

  //过往假期状态
  app.get('/note/reqAllState', Note.reqAllState);




  // 测试页面效果
  app.get('/page/:pageName', function (req, res) {
    var pageName = req.params.pageName;
    res.render(pageName, { title: 'Hey', message: 'Hello there!'});
  });

  app.get('/test/personal-info', function (req, res) {
    var user = {
        "_id": "584aab9f23ac5520a7cf0947",
        "userRole": "584aab46b4f2d71f8a186278",
        "userPwd": "$2a$10$HVl5Bm1HpPjoeCegwaC/Wez6kH8R/lg.gQlqzXiyvDx2KpwzYLTky",
        "userName": "Bruce"
    };
    var data = { title: 'test/personal-info', user: user, alreadyLogin:true};
    res.render('personal-info', data);
    // res.render('test_jade');
    // res.status(200).json(data);
    // res.send(data);
  });


  // 测试函数，替换想要测试的数据库操作函数即可
  app.get('/test/db', Note.test);


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
