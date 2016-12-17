var debug = require('debug')('attendance:userController');
var User = require('../models/user');

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

class Student {
    constructor(userWithAllInfo) {
      var user = userWithAllInfo;

      this.userRealName = user.userRealName;
      this.userName = user.userName;
      this.userDepartment = user.userDepartment;
      this.userEmail = user.userEmail;
      this.userRoleName = user.userRole.roleName;
    }
}

function getUserInfoCombined(userWithAllInfo) {
  return new Promise(function(resolve) {

    resolve(new Student(userWithAllInfo));
  });

}

// personal-info page
exports.findUserInfo = function(req, res, next){
  debugRequest(req);

  //从session 中获取
  //var id = req.session.user._id;
  var id = '584aab9f23ac5520a7cf0947';
  console.log('Get userId from session: ', id);

  User.findById(id)
  .then(function(user){
    debug('Get user from db:%s', JSON.stringify(user));
    return getUserInfoCombined(user)
    .then(function(userInfo){
      var data = { title: '个人信息', user: userInfo, alreadyLogin:true};
      debug('data to send back', data);
      res.render('personal-info', data);
      // res.send(data);
    });
  })
  .catch(next); // DO not need to care about user id not found, since we alreay have session.
};

// personal-info update
exports.updateUserInfo = function(req, res, next){
  debugRequest(req);

  //从session 中获取
  //var id = req.session.user._id;
  var id = '584aab9f23ac5520a7cf0947';
  console.log('Get userId from session: ', id);

  var conditions = {_id : id};
  var update = req.body.user; // Just update a whole,there should consider password hash
  var options = { multi: false};

  debug('data to update: conditions:%s, update:%s', JSON.stringify(conditions), JSON.stringify(update));
  User.update(conditions, update, options)
  .then(function(changedInfo){
    debug('Update note info succeeded');
    // res.send(changedInfo);

    User.findById(id)
    .then(function(user){
      debug('Get user from db:%s', JSON.stringify(user));
      return getUserInfoCombined(user)
      .then(function(userInfo){
        var data = { title: '个人信息', user: userInfo, alreadyLogin:true};
        debug('data to send back', data);
        res.render('personal-info', data);
        // res.send(data);
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
