var HolidayType = require('../models/holidayType');


exports.new = function(req, res){
  var _holidayType = req.body.holidayType;
  var holidayType = new HolidayType(_holidayType);

  holidayType.save(function(err, holidayType){
    if(err){
      console.log(err);
    }else{
      res.send(holidayType);
    }
  });
};
