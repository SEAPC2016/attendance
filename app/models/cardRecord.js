var mongoose = require('mongoose');
var CardRecordSchema = require('../schemas/cardRecord');
var CardRecord = mongoose.model('CardRecord', CardRecordSchema);

module.exports = CardRecord;
