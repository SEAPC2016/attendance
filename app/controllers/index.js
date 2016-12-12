//var express = require('express');
var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');

var moment = require('moment');

/* GET home page. */
exports.index = function(req, res, next) {
  res.render('index', { title: 'index' });
};








// // HolidayType Holiday And User Info
exports.holandUser = function(req, res, next){
  console.log("coold");
  //var userId = req.body.userID;
  userId = '584aab9f23ac5520a7cf0947';

    //通过user的ObjectId， 拿到对应的用户信息以及各类假期剩余天数就好了
    //1. 拿到所有的假期类型
    /**
    //2 拿到一个时间段内员工某个假期类型请假的天数
    *  a. 查询当下时间到今年的1月1号该类行假期请假的天数
    *  b. 根据该类型假期的总时长得到剩余时长
    */
  console.log(userId);
  if(userId){
    User
      .find({_id: userId})
      .populate({
        path:'userRole'
        //select: 'roleName Poster'
      })
      .exec(function(err, userRes){
          if(err){
            console.log(err);
          }
          console.log(userRes + "\n" + userRes[0].userRole.roleName);
          HolidayType
            .find()
            .exec(function(err, holidayTypes){
                if(err){
                  console.log(err);
                }
                console.log(holidayTypes);
                var holiday = {name:null,length:null};
                var holidays = {};
                var holidayLength = holidayTypes.length;
                for(var i=0; i<holidayLength; i++){//计算该假期剩余多少天
                  console.log(userRes[0]._id + '\n'+ holidayTypes[i]._id);
                  holiday.name = holidayTypes[i].holidayName;
                  /**
                   * 这里的执行结果慢了不止一拍，怎么办？？ 有什么解决方法？
                  */
                  holiday.length = count(userRes[0]._id, holidayTypes[i]._id);
                  holidays[i] = holiday;
                  console.log("\n 没有？ "+ holidays[i].name+ "\n" + holidays[i].length);
                }
                res.send(holidays);
                // res.render('/reqHoliday' ,{
                //   title:'请假',
                //   role: userRes[0].userRole.roleName,
                //   //写成如下格式会报错
                //   //role: userRes.userRole.roleName,
                //   user: userRes[0],
                //   holidayTypes:holidayTypes,
                //   holidays: holidays
                // });
            });
      });
  }
};


//根据用户ID , 假期类型ID , 时间参数查询假期剩余天数

/**
 * 1) 根据用户ID, 假期ID , 当前时间，以及默认的这一年的开始时间，
 *   查询一下内容： 这段时间内高用户该种假期的所有记录时间总和
*/

function count(_userId, _holidayTypeId) {
    var _now = moment();
    var now = new Date();
    var year = _now.get('year');
    //console.log("year = "+ year + "; year =" + now);
    var timeLength = 0;
    Note
      .find({'user': _userId, 'holidayType': _holidayTypeId})
      .gte('startTime',year)
      .lte('startTime',now)
      //.where('user').equals( _userId)
      //.where('holidayType').equals(_holidayTypeId)
      .exec(function(err, holidays){
        if(err){
          console.log(err);
        }else{
          holidays.forEach(function(value){
           timeLength += value.timeLength;
          });
         console.log(timeLength);
        }
      });
    return timeLength;
}
