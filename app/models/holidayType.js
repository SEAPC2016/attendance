var mongoose = require('mongoose');
var HolidayTypeSchema = require('../schemas/holidayType');
var HolidayType = mongoose.model('HolidayTYpe',HolidayTypeSchema);

module.exports = HolidayType;
