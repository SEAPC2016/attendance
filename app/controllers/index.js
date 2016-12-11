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
// exports.holandUser = function(req, res, next){
//   console.log("coold");
//   //var userId = req.body.userID;
//   userId = '584aab9f23ac5520a7cf0947';
//
//     //通过user的ObjectId， 拿到对应的用户信息以及各类假期剩余天数就好了
//     //1. 拿到所有的假期类型
//     /**
//     //2 拿到一个时间段内员工某个假期类型请假的天数
//     *  a. 查询当下时间到今年的1月1号该类行假期请假的天数
//     *  b. 根据该类型假期的总时长得到剩余时长
//     */
//   console.log(userId);
//   if(userId){
//     User
//       .find({_id: userId})
//       .populate({
//         path:'userRole'
//         //select: 'roleName Poster'
//       })
//       .exec(function(err, userRes){
//           if(err){
//             console.log(err);
//           }
//           console.log(userRes + "\n" + userRes[0].userRole.roleName);
//           HolidayType
//             .find({})
//             .exec(function(err, holidayTypes){
//                 if(err){
//                   console.log(err);
//                 }
//                 console.log(holidayTypes);
//                 var length = holidayTypes.length;
//                 console.log(length);
//                 var holidays = {};
//                 //var holidayLength = ;
//
//                 for(var i=0; i<length; i++){
//                   holidays[holidayTypes[i]] = count(userRes._id, holidayTypes[i]._id);
//                 }
//
//                 console.log("这个:"+holidays+" ： 呢");
//                 res.render('/reqHoliday' ,{
//                   title:'请假',
//                   role: userRes[0].userRole.roleName,
//                   //写成如下格式会报错
//                   //role: userRes.userRole.roleName,
//                   user: userRes[0],
//                   holidayTypes:holidayTypes,
//                   holidays: holidays
//                 });
//             });
//       });
//
//     // User.findById(userId,function(err, user){
//     //   if(err){
//     //     console.log(err);
//     //   }
//     //   console.log("ool");
//     //   HolidayType.fetch(function(err, holidayTypes){
//     //     if(err){
//     //       console.log(err);
//     //     }else{
//     //       var length = holidayTypes.length;
//     //       var holidays = {};
//     //       //var holidayLength = ;
//     //       for(var i=0; i<length; i++){
//     //         holidays[holidayTypes[i]] = Note.count(user._id, holidayTypes[i]._id);
//     //       }
//     //       res.render('/reqHoliday',{
//     //         title:'请假',
//     //         role: role,
//     //         user: user,
//     //         holidayTypes:holidayTypes,
//     //         holidays: holidays
//     //       });
//     //     }
//     //   });
//     // });
//   }
// };
//
//
// //根据用户ID , 假期类型ID , 时间参数查询假期剩余天数
// function count(_userId, _holidayTypeId) {
//     var _now = moment();
//     var now = new Date();
//     var year = _now.get('year');
//     console.log("year = "+ year + "; year =" + now);
//     console.log(Note.mapReduce(
//       function(){emit(_holidayTypeId, Note.timeLength);},
//       function(key,values){return Array.sum(values);},
//       {
//          query: {user: _userId},
//          out: "holidayLength"
//       }
//     ).find());
// }
