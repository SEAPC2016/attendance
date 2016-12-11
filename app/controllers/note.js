var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');


//add new note
// exports.new = function(req, res){
//   var _note = req.body.note;
//   var note = new Note(_note);
//   note = note.judgeState(note);
//   console.log(note);
//   note.save(function(err, note){
//       if(err){
//         console.log(note);
//       }else{
//         res.send(note);
//       }
//   });
// };


//require Holiday
exports.new = function(req, res){
  //获取参数
  var _note = req.body.note;
  console.log("接收到的_note :" + _note);

  var note = new Note(_note);

  User
  .find({"_id": note.user})
  .populate({path: 'userRole'})
  .exec(function(err, user){
    note = note.setState(user[0],note);
    console.log('添加状态的note :'+ note );
    note.save(function(err, note){
      if(err){
        console.log(err);
      }else{
        //跳转到请假状态页
        console.log("写入数据库后的回调:"+note);
        // res.render('reqState', {
        //       title: "请假状态页",
        //       note: note
        // });
        res.send(note);
      }
    });
  });
};
