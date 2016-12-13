#接口描述
> 描述形式 ： 调用方法，URI, 调用控制器名称，调用控制器方法名称

//首页内容
app.get('/', Index.index);

//请假首页，显示用户基本信息，用户假期信息，以及用户请假填写表单
app.get('/holandUser', Index.holandUser);

//admin

//查找某个用户
app.post('/user/find', User.findOne);


//添加新用户
app.post('/user/new',User.new);

//添加新角色
app.post('/role/new',Role.new);

//添加新的假期类型
app.post('/holidaytype/new', HolidayType.new);


//添加新的请假记录
app.post('/note/new', Note.new);


//这个还没有更改，查看请假状态，没有连接URI  
app.get('/form-wizard', function (req, res) {
  res.render('form-wizard', {
      title: 'form-wizard'
  });
});
