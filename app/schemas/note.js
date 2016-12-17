var mongoose = require('mongoose');
var moment = require('moment');
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
  meta:{
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
    this.meta.updateAt = Date.now();
  }
  next();
});


NoteSchema.statics = {
  //取出数据库中目前拥有的数据
  fetch: function(cb){
    return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb);
  },
  //根据ID取出数据单条数据
  findById: function(id, cb){
    return this
            .findOne({_id : id})
            .sort("meta.updateAt")
            .exec(cb);
  },

  //根据 state 取出数据单条数据
  findByState: function(state, cb){
    return this
            .find({curState : state}).populate('user').populate('holidayType')
            .sort("meta.updateAt")
            .exec(cb);
  }
};
  //实例方法
NoteSchema.methods ={

};


module.exports = NoteSchema;
