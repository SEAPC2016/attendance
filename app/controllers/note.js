var debug = require('debug')('attendance:noteController');
var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');
var NoteSchema = require('../schemas/note');

var debugNewRequest = '\n\n\n\n\n\n\n\n\n\n\n\n'; // sepearate new debug with some newlines


 //require Holiday
exports.new = function(req, res){
  //获取参数
  var _note = req.body.note;
  //console.log("接收到的_note :" + _note);

  //调试信息
  debug(debugNewRequest + 'Get params from front,note:\n' + JSON.stringify(_note));

  var curNote = new Note(_note);

  User
  .find({"_id": curNote.user})
  .populate({path: 'userRole'})
  .exec(function(err, _user){
    var user = _user[0];
    debug('Get User and UserRole,note:\n' + JSON.stringify(user));
    debug('curNote,note:\n' + JSON.stringify(curNote));

    //var note = setState(user[0],curNote);
    HolidayType
       .find({_id: curNote.holidayType})
       .exec(function(err, holidayTypes){
         debug('setState holidayTYpe:\n' + JSON.stringify(holidayTypes[0]));
         var holidayType = holidayTypes[0];
         if(holidayType.holidayName === '事假' || holidayType.holidayName === '年假' || holidayType.holidayName === '病假'){
             if(curNote.timeLength <= 1){//t<=1          部门经理
                 curNote.highState = 10;
             }else if(_note.timeLength <=3){//1<t<=3        部门经理+副总
               curNote.highState = 20;
             }else{//3<t          部门经理+副总经理+总经理
               curNote.highState = 30;
             }
           }else if(holidayType.holidayName === '工伤假'  || holidayType.holidayName === '产假' || holidayType.holidayName === '婚假'){
             //总经理
             curNote.highState = 30;
           }else if(holidayType.holidayName === '产检假'){
               if(curNote.timeLength <=1 ){//t<=1           部门经理
                 curNote.highState = 10;
               }else{//1<t            部门经理+总经理
                 curNote.highState = 30;
               }
           }else if(holidayType.holidayName === '丧假'){
               if(curNote.timeLength){//t<=1           部门经理
                 curNote.highState = 10;
               }else{//1<t            部门经理+副总经理
                 curNote.highState = 20;
               }
           }else if(holidayType.holidayName === '公益假'){
               //部门经理
               curNote.highState = 10;
           }else{ //其他假日 过
             curNote.highState = -1;
           }
           if(user.userRole.roleName === '员工'){
             curNote.curState = 1;
           }else if(user.userRole.roleName === '部门经理'){
             curNote.curState = 10;
           }else if(user.userRole.roleName === '副总经理'){
             curNote.curState = 20;
           }else if(user.userRole.roleName === '总经理'){
             curNote.curState = 30;
           }
           debug('setState 中 note:\n' + JSON.stringify(curNote));
           //res.send(note);
           if(curNote.highState <= curNote.curState){
             curNote.curState = -1;
           }
           curNote.save(function(err, _note){
             if(err){
               console.log(err);
             }else{
               //跳转到请假状态页
               debug('_note,note:\n' + JSON.stringify(_note));
               var note = _note[0];

               res.render('reqState', {
                      title: "请假状态页",
                      note: note
               });
               debug('Create new note succeeded');
               //res.send(note);
             }
           });
       });
  });
};


function findRoleByUserId(userId){
  return User.findById(userId)
  .then(function(user){
    debug('Found user by userId:%s:\n%s', userId, user);
    var role = user.userRole;
    debug('Role of user:\n' + role);
    return role;
  });
}

exports.findNotesByManagerId = function (req, res, next){

  // var managerId = "58493581f210182bbc28713f";
  var managerId = req.params.managerId;
  debug(debugNewRequest + 'Get params from front,managerId:\n' + managerId);

  findRoleByUserId(managerId)
  .then(function(role){
    Note.findByState(role.preState)
    .then(function(notes){
      debug('Find all notes by manager preState, notes.length:' + notes.length);
      // return res.send(notes);
      res.render('examine', {
            title: "待审核假期",
            notes: notes
      });
    });
  })
  .catch(next);
};


function _updateStateByManager(managerId, note, approved){ // this way of `res` is ugly.

  // create a new Promise to avoid look into database when manager disapprove this note.
  return new Promise(function(resolve) {
    if(approved === false){
      debug('Set note state to 0 beacuse of disapprove');
      resolve(0);
    }
    else{
      return findRoleByUserId(managerId)
      .then(function(role){
        if (role.postState === note.highState){
          debug('Set note state to -1, approved and role.postState === note.highState');
          resolve(-1);
        }
        else{
          debug('Set note state to ' + role.postState + ', approved but role.postState != note.highState');
          resolve(role.postState);
        }
      });
    }
  });


// Or, just a more clean way.
/*
  return findRoleByUserId(managerId)
  .then(function(role){
    if(approved === false){
      debug('Set note state to 0 beacuse of disapprove');
      return 0;
    }

    if (role.postState === note.highState){
      debug('Set note state to -1, approved and role.postState === note.highState');
      return -1;
    }
    else{
      debug('Set note state to ' + role.postState + ', approved but role.postState != note.highState');
      return role.postState;
    }
  });
*/
}


exports.updateStateByManager = function (req, res, next){

  var managerId = req.body.managerId;
  var noteId = req.body.noteId;
  var approved = req.body.approved;

  debug(debugNewRequest + 'Get params from front end, managerId:%s, noteId:%s, approved:%s\n', managerId, noteId, approved);

  var newState = 0;

  Note.findById(noteId)
  .then(function(note){
    debug('Found note by noteId %s:\n%s', noteId, note);

    _updateStateByManager(managerId, note, approved)
    .then(function(newState){
      var conditions = {_id : note._id};
      var update = { $set : {curState:newState}};
      var options    =  { multi: false };
      return Note.update(conditions, update, options)
      .then(function(changedInfo){
        debug('Update note info succeeded');
        res.send(changedInfo);
      });
    });
  })
  .catch(next);
};
