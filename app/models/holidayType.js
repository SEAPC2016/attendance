var mongoose = require('mongoose');
var HolidayTypeSchema = require('../schemas/holidayType');
var HolidayType = mongoose.model('HolidayType',HolidayTypeSchema);

module.exports = HolidayType;
