var mongoose = require('mongoose');
var HolidayType = require('./holidayType');
var User = require('./user');

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var NoteSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  holidayType: {
    type: ObjectId,
    ref: 'HolidayType'
  },
  startTime: Date,
  timeLength: Number,
  reason: String,
  curState: Number,
  highState: Number,
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

NoteSchema.pre('save', function(next){
  var note = this;
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }else{
    this.meta.updateAt = Data.now();
  }
  next();
});


NoteSchema.statics = {
  //获取表内全部数据
  fetch: function(cb){
      return this
              .find({})
              .sort('meta.updateAt')
              .exec(cb);
  },
  //根据ID取出单条数据
  findById: function(id, cb){
    return this
            .find({_id: id})
            .sort("meta.updateAt")
            .exec(cb);
  }
};


//实例方法
NoteSchema.methods ={
  //根据用户角色，对Note置初始状态
  setState:function(_user,_note){
     console.log(_user);
     if(_user.userRole.roleName === '员工'){
       _note.curState = 0;
       _note.highState = 1;
     }else if(_user.userRole.roleName === '部门经理'){
       _note.curState = 0;
       _note.highState = 1;
     }else if(_user.userRole.roleName === '副总经理'){
       _note.curState = 0;
       _note.highState = 1;
     }else if(_user.userRole.roleName === '总经理'){
       _note.curState = 0;
       _note.highState = 1;
     }
     return _note;
  }
};

module.exports = NoteSchema;
