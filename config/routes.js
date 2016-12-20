var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Role = require('../app/controllers/role');
var HolidayType =require('../app/controllers/holidayType');
var Note = require('../app/controllers/note');


module.exports = function(app){

  //pre  handle user  用户登录session处理
  app.use(function(req, res, next){
    //注意这里逻辑的变化
    var _user = req.session.user;
    //console.log(_user);
    app.locals.user = _user;
    var _role = req.session._role;
    if(_role){
      app.locals._role = _role;
    }
    next();
  });

  //Index
  //app.get('/', Index.index);
  //获取用户信息以及假期剩余信息
  app.get('/holandUser', User.signinRequired, Index.holandUser);


  //这里是什么意思？？
  // app.get('/', Index.index);
	app.get('/', Note.IndexWithHolidayInfo);

	app.post('/queryOtherPersonHoliday', Note.IndexQueryOnePersonHolidayInfo); // Better to be get

  //获取用户信息以及假期剩余信息
  //app.get('/holandUser', Index.holandUser);

  //admin


  //User
  app.post('/user/find', User.signinRequired,User.findOne);

  //查找用户信息
  app.get('/user/findUserInfo', User.signinRequired, User.findUserInfo);

  //更新用户信息
  app.post('/user/update', User.signinRequired, User.updateUserInfo);


  // in postman:
  // Headers, Content-Type application/json
  // Body raw
  // {"user":{"userName":"stuff1","userPwd":"123456","userRole":"58492926f210182bbc287137"}}
  app.post('/user/new',User.new);

  //signin， 登陆系统
  app.post('/user/signin', User.signin);

  //登出系统
  app.get('/user/logout', User.logout);



  //Role
  // {"role":{"roleName":"员工"}}  新增角色
  app.post('/role/new', Role.new);

  //HolidayType ， 新增假期类型
  // {"holidayType":{"holidayName":"年假","holidayLength":5}}
  app.post('/holidaytype/new', HolidayType.new);

  //新增请假申请信息
  // {"note":{"userObject":"5849349cf210182bbc28713b","htObject":"584938c2f210182bbc287143","timelength":3}}
  app.post('/note/new', User.signinRequired, Note.new);

  app.get('/notes/manager', User.signinRequired, Note.findManagerCanHandleNotes);

  // {"noteId":"58493eabd5d47f3948fe85ba","approved":true}, managerId can be found from session
  app.post('/notes/manager', User.signinRequired, Note.updateStateByManager);

  //app.post('/user/reqHoliday',Note.reqHoliday);

  //最新假期状态
  app.get('/note/reqLatestState', User.signinRequired ,Note.reqLatestState);


  //过往假期状态
  app.get('/note/reqAllState', User.signinRequired, Note.reqAllState);

  //假期详情
  app.get('/note/noteInfo/:id', User.signinRequired, Note.noteInfo);

  //注销假期
  app.get('/note/destroy/:id', User.signinRequired, Note.destroy);


  //Record   查询打卡记录
  app.get('/user/calendar', User.signinRequired, function(req, res){
    res.render('calendar' ,{
        title: '上班记录'
    });
  });


  // 测试页面效果
  app.get('/page/:pageName', function (req, res) {
    var pageName = req.params.pageName;
    res.render(pageName, { title: 'Hey', message: 'Hello there!'});
  });
  // app.get('/test/note', Note.test);
  app.get('/test/index', Index.test);


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
