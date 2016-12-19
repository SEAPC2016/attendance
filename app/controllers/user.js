var debug = require('debug')('attendance:userController');
var User = require('../models/user');
var Role = require('../models/role');

//npm库，专门为密码设计的算法
var bcrypt = require('bcrypt');

var debugNewRequest = '\n\n\n\n\n\n\n\n\n\n\n\n'; // sepearate new debug with some newlines

function debugRequest(req){
  debug(debugNewRequest + 'Get req body: %s, req params: %s', JSON.stringify(req.body), JSON.stringify(req.params));
}

/* GET users listing. */
exports.userlist = function(req, res) {
  User.fetch(function(err, users){
    if(err){
      console.log(err);
    }
    console.log(users);
    res.send(users);
  });
};


exports.findOne = function(req, res){
  var id = req.body.id;
  console.log(id);

  User
    .find({"_id":id}) //注意这里的参数设置 如果 "_id" 不填家双引号，汇出错的
    .populate({path:'userRole'})
    .exec(function(err, user){
      console.log(user[0].userRole.roleName);
      res.send(user);
    });
};


// personal-info page
exports.findUserInfo = function(req, res, next){
  debugRequest(req);
  var _user = req.session.user;
  var id = _user._id;
  //从session 中获取
  //var id = req.session.user._id;
  //var id = '584aab9f23ac5520a7cf0947';
  console.log('Get userId from session: ', id);

  User.findById(id)
  .then(function(user){
    user.userRoleName = user.userRole.roleName; // 直接赋值
    debug('Get user from db:%s', JSON.stringify(user));
    var data = { title: '个人信息', user: user, alreadyLogin:true};
    debug('data to send back', data);
    res.render('personal-info', data);
  })
  .catch(next); // DO not need to care about user id not found, since we alreay have session.
};


function getPwdWithSalt(userInfoWithoutId) {
  return new Promise(function(resolve) {
    //生成随机盐，两个参数第一个参数为计算强度，时间*方法  第二个参数为回掉方法，能达到盐
    bcrypt.genSalt(10,function(err, salt){
        bcrypt.hash(userInfoWithoutId.userPwd, salt, function(err, hash){
          resolve(hash);
        });
    });
  });
}



// personal-info update
exports.updateUserInfo = function(req, res, next){
  debugRequest(req);
  var _user = req.session.user;
  var id = _user._id;
  //从session 中获取
  //var id = req.session.user._id;
  //var id = '584aab9f23ac5520a7cf0947';
  console.log('Get userId from session: ', id);

  var conditions = {_id : id};
  var update = req.body.user; // Just update a whole,there should consider password hash
  var options = { multi: false};


  getPwdWithSalt(update)
  .then(function(hash){
    update.userPwd = hash;
    console.log('data to update: conditions:%s, update:%s', JSON.stringify(conditions), JSON.stringify(update));
    User.update(conditions, update, options)
    .then(function(changedInfo){
      debug('Update note info succeeded');
      // res.send(changedInfo);

      User.findById(id)
      .then(function(user){
        user.userRoleName = user.userRole.roleName; // 直接赋值
        debug('Get user from db:%s', JSON.stringify(user));
        var data = { title: '个人信息', user: user, alreadyLogin:true};
        debug('data to send back', data);
        res.render('personal-info', data);
      });
    });
  })
  .catch(next);

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
     }
     //用户不存在
     if(user === null){
       //用户不存在
       return res.redirect('/');
     }

     console.log(user);
     user.comparePassword(password, function(err, isMatch){
       if(err){
         console.log(err);
       }

       if(isMatch){
         //保存用户状态，利用会话
         req.session.user = user;

         Role
          .find({'_id': user._id})
          .exec(function(err, role){
            if(err){
              console.log(err);
            }else{
              var _role = null;
              if(role.roleName === '员工'){
                _role = 0;
              }else{
                _role = 1;
              }
              console.log("password is match");
              //返回登录后的首页
              req.session._roleNum = _role;
              return res.redirect('/');
            }
          });

       }else{
         console.log("password is not match");
         //密码错误返回登录页
         return res.redirect('/');
       }
     });
   });
};

exports.logout = function(req, res){
  delete req.session.user;
  //  delete app.locals.user
  res.redirect("/");
};

//User中间件权限控制


function mockSessionForTest(){
  debug('WE ARE GOING TO MOCK A USER FOR TEST');
  var userId = '58574da4b3c7c31c7c56c36d'; // this is a DM
  return new Promise(function(resolve) {
    User.findById(userId)
    .then(function(user){
      var mockSession = {};
      mockSession.user = user;
      mockSession._roleNum = user.userRole;
      resolve(mockSession);
    });
  });
}


exports.signinRequired = function(req, res, next){
  //signinRequired_test(req, res, next)
  signinRequired_real(req, res, next);
};


//midware for test
function signinRequired_test(req, res, next){
  debug('WE ARE GOING TO MOCK A SINGIN');
  mockSessionForTest()
  .then(function(mockSession){
    req.session.user = mockSession.user;
    req.session._roleNum = mockSession.user.userRole;
    var user = req.session.user;
    if(!user){
      return res.redirect('/');
    }
    next();
  })
  .catch(next);
}

//midware for user
function signinRequired_real(req, res, next){
  var user = req.session.user;
  if(!user){
    return res.redirect('/');
  }
  next();
}

//midware for user
/*
exports.signinRequired = function(req, res, next){
  var user = req.session.user;
  if(!user){
    return res.redirect('/');
  }
  next();
};
*/

//midware for admin
exports.adminRequired = function(req, res, next){
  var user = req.session.user;

  if(user.role <= 10){
    return res.redirect('/');
  }
  next();
};
