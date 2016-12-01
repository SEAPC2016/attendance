
var User = require('../models/user');

/* GET users listing. */
exports.userlist = function(req, res, next) {
  User.fetch(function(err, users){
    if(err){
      console.log(err);
    }
    console.log(users);
    res.send(users);
  });
  //res.render('index', { title: '比' });
};


exports.new = function(req, res, next){
  console.log("OK : "+ req);
  var _user = req.body.user;

  console.log(_user);



  var user = new  User(_user);

  user.save(function(err, user){
    if(err){
      console.log(err);
    }else{
      res.send(user);
    }
  });
};
