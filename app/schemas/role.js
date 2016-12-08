var mongoose = require('mongoose');

//在这个对象中描述用户的文档结构和数据类型
var RoleSchema = new mongoose.Schema({
  roleName: {
    type: String
  },
  preState: Number,
  postState: Number,
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

RoleSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }
  next();
});



//静态方法，在模型中就可以调用
RoleSchema.statics = {
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
      .findOne({_id: id})
      .exec(cb);
  }
};



module.exports = RoleSchema;
