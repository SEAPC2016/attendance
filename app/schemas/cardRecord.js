var mongoose = require('mongoose');
var moment = require('moment');
var User = require('./user');

var Schema = mongose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CardRecordSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  enterTime: {
    type: Date,
    default: Date.now()
  },
  leftTime: {
    type: Data,
    default: Date.now()
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt:{
      type: Date,
      default: Date.now()
    }
  }
});

module.exports = CardRecordSchema;
