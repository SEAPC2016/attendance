var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');

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
    note = setState(user[0],note);
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



//根据用户角色，对Note置初始状态
function setState(_user,_note){
   HolidayType
      .find({_id: _note.holidayType})
      .exec(function(err, holidayType){
        if(holidayType.holidayName.equals('事假') || holidayType.holidayName.equals('年假') || holidayType.holidayName.equals('病假')){
            if(_note.timeLength <= 1){//t<=1          部门经理
                _note.highState = 10;
            }else if(_note.timeLength <=3){//1<t<=3        部门经理+副总
              _note.highState = 20;
            }else{//3<t          部门经理+副总经理+总经理
              _note.highState = 30;
            }
          }else if(holidayType.holidayName.equals('工伤假') || holidayType.holidayName.equals('产假') || holidayType.holidayName.equals('婚假')){
            //总经理
            _note.highState = 30;
          }else if(holidayType.holidayName.equals('产检假')){
              if(_note.timeLength <=1 ){//t<=1           部门经理
                _note.highState = 10;
              }else{//1<t            部门经理+总经理
                _note.highState = 30;
              }
          }else if(holidayType.holidayName.equals('丧假')){
              if(_note.timeLength){//t<=1           部门经理
                _note.highState = 10;
              }else{//1<t            部门经理+副总经理
                _note.highState = 20;
              }
          }else if(holidayType.holidayName.equals('公益假')){
              //部门经理
              _note.highState = 10;
          }
          if(_user.userRole.roleName === '员工'){
            _note.curState = 0;
          }else if(_user.userRole.roleName === '部门经理'){
            _note.curState = 10;
          }else if(_user.userRole.roleName === '副总经理'){
            _note.curState = 20;
          }else if(_user.userRole.roleName === '总经理'){
            _note.curState = 30;
          }
          //console.log(_user);
          return _note;
      });
}
