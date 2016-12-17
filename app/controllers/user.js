

var User = require('../models/user');

/* GET users listing. */
exports.userlist = function(req, res) {
  User.fetch(function(err, users){
    if(err){
      console.log(err);
    }
    console.log(users);
    res.send(users);
  });
  //res.render('index', { title: '比' });
};


exports.findOne = function(req, res){
  var id = req.body.id;
  console.log(id);
  // User
  //   .findById(id,function(err, user){
  //      res.send(user);
  //   });
  User
    .find({"_id":id}) //注意这里的参数设置 如果 "_id" 不填家双引号，汇出错的
    .populate({path:'userRole'})
    .exec(function(err, user){
      console.log(user[0].userRole.roleName);
      res.send(user);
    });
//    .populate({path: 'userRole'})
//    .pretty()
    // .exec(function(err, user){
    //   if(err){
    //     console.log(err);
    //   }else{
    //     res.send(user);
    //   }
    // });
};

// personal-info page
exports.findUserInfo = function(req, res){
  //var id = req.params.userId;
  //从session 中获取
  //var id = req.session.user._id;
  var id = '584aab9f23ac5520a7cf0947';
  console.log('Get params from front end, userId:', id);
  User.findById(id)
  .then(function(user){
    var data = { title: '个人信息', user: user, alreadyLogin:true};
    console.log('data to send back', data);
    res.render('personal-info', data);
  })
  .catch(function(err){
    console.log('err:%s, aka not found user by provided id:%s', err, id);
    var data = { title: '个人信息', user: user, alreadyLogin:false}; // not found user, alreadyLogin set false
    console.log('data to send back', data);
    res.render('personal-info', data);
    // next();
  });
};




exports.new = function(req, res){
//  console.log("OK : "+ req);
  var _user = req.body.user;

  console.log(_user);



  var user = new  User(_user);
  // user.userName = 'Cool';
  // user.userPwd = '123456';
  // user.userRole = '584aab46b4f2d71f8a186278';
  user.save(function(err, user){
    if(err){
      console.log(err);
    }else{
      res.send(user);
    }
  });
};

//signin
exports.signin = function(req, res){
  var _user = req.body.user;
  var name = _user.userName;
  var password = _user.userPwd;

  console.log(_user);
  console.log(password+":"+name);
//用户是否存在
  User.findOne({userName: name}, function(err, user){
     if(err){
       console.log(err);
     //用户不存在
     if(user === null){
       //用户不存在
       return res.redirect('/');
     }

   }
     console.log(user);
     user.comparePassword(password, function(err, isMatch){
       if(err){
         console.log(err);
       }

       if(isMatch){
         //保存用户状态，利用会话
         req.session.user = user;

         console.log("password is match");
         //返回登录后的首页
         return res.redirect('/');
       }else{
         console.log("password is not match");
         //密码错误返回登录页
         return res.redirect('/');
       }
     });
   });
};



//User中间件权限控制

//midware for user
exports.signinRequired = function(req, res, next){
  var user = req.session.user;
  if(!user){
    return res.redirect('/signin');
  }
  next();
};

//midware for admin
exports.adminRequired = function(req, res, next){
  var user = req.session.user;

  if(user.role <= 10){
    return res.redirect('/signin');
  }
  next();
};
