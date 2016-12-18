var mongoose = require('mongoose');


var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;


//npm库，专门为密码设计的算法
var bcrypt = require('bcrypt');

//计算强度
var SALT_WORK_FACTOR = 10;

//在这个对象中描述用户的文档结构和数据类型
var UserSchema = new mongoose.Schema({
  userName: {
    type: String
  },
  userPwd: String,
  userEmail: String,
  userRole: {
     type: ObjectId,
     ref: 'Role'
   },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
});

UserSchema.pre('save',function(next){
  var user = this;
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }
  //生成随机盐，两个参数第一个参数为计算强度，时间*方法  第二个参数为回掉方法，能达到盐
  bcrypt.genSalt(SALT_WORK_FACTOR,function(err, salt){
    if(err) return next(err);

      bcrypt.hash(user.userPwd, salt, function(err, hash){
        if(err) return next(err);
        user.userPwd = hash;
        //进入下一步
        next();
      });
  });
});


//实例方法，在实例对象处可以调用
UserSchema.methods = {
  comparePassword: function(_userPwd, cb) {
    bcrypt.compare(_userPwd, this.userPwd, function(err, isMatch) {
      if (err) return cb(err);

      cb(null, isMatch);
    });
  }
};

//静态方法，在模型中就可以调用
UserSchema.statics = {
  //取出目前数据库中所有数据
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb);
  },
  //查询单条目录
  findById: function(id, cb){
    return this
      .find({_id: id})
      .findOne({_id: id}).populate('userRole')
      .exec(cb);
  },
	
	findLikeUserName: function(userName, cb) {
		return this
				// .find({'userName': new RegExp('.*'+userName+'.*')})
				.find({'userName': new RegExp(userName, "i")})
				.sort('meta.updateAt')
				.exec(cb);
	}
};



module.exports = UserSchema;
