var mongoose = require('mongoose');

var HolidayTypeSchema = new mongoose.Schema({
  holidayName: String,
  holidayLength: Number,
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


HolidayTypeSchema.pre('save', function(next){
  var user = this;
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now();
  }
  else{
    this.meta.updateAt = Date.now();
  }
  next();
});

HolidayTypeSchema.statics = {
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
            .find({_id : id})
            .sort("meta.updateAt")
            .exec(cb);
  }
};

module.exports = HolidayTypeSchema;
