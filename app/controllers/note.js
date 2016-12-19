var debug = require('debug')('attendance:noteController');
var Note = require('../models/note');
var User = require('../models/user');
var HolidayType = require('../models/holidayType');
var Role = require('../models/role');
var Moment = require('moment');

var debugNewRequest = '\n\n\n\n\n\n\n\n\n\n\n\n'; // sepearate new debug with some newlines

function debugRequest(req){
  debug(debugNewRequest + 'Get req body: %s, req params: %s', JSON.stringify(req.body), JSON.stringify(req.params));
}

 //require Holiday
exports.new = function(req, res){
  debugRequest(req);
  //获取参数
  var _note = req.body.note;

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
         debug('setState holidayTYpe:\n' + JSON.stringify(holidayTypes));
         var holidayType = holidayTypes;
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
           console.log(curNote);
           curNote.save(function(err, _note){
             if(err){
               console.log(err);
             }else{
               //跳转到请假状态页
               debug('_note,note:\n' + JSON.stringify(_note));
               //var note = _note[0];
               res.render('reqLatestState', {
                      title: "请假状态页",
                      curState: _note.curState,
                      roleName : user.userRole.roleName
               });
               debug('Create new note succeeded');
               //res.send(note);
             }
           });
       });
  });
};


//最新假期状态
exports.reqLatestState = function(req, res){
    var _user = req.session.user;
    var userId = _user._id;
    //var userId = '584aab9f23ac5520a7cf0947';
    debug('userId : ' + userId);
    Note
      .find({'user': userId})
      .sort({'startTime': -1})
      .limit(1)
      .exec(function(err, note){
          if(err){
            console.log(err);
          }else{

              Role
                .find({'_id': _user.userRole})
                //.find({'_id': '584aab46b4f2d71f8a186278'})
                .exec(function(err, _role){
                  if(err){
                    console.log(err);
                  }else{
                    var _note = new Note();
                    if(note.length <=0){
                      _note.curState =  -3;
                    }
                //    var user = new User();
                //    user.userName = "COll";
                  console.log(_role[0].roleName);
                  console.log(note);
                    res.render('reqLatestState', {
                      title: "请假状态页",
                      curState: _note.curState,
                      roleName: _role[0].roleName,
                    });
                    debug('Query note succeeded');
                  }
                });
          }
      });
};

//过往假期状态
exports.reqAllState = function(req, res){
    var _user = req.session.user;
    var userId = _user._id;
    var p = req.query.p;
//    var p = 0;
     console.log(p);
     if(p === undefined){
       p = 0;
     }
     console.log(p);
    var Count = 10;
    var index = p*Count;

    //var userId = '584aab9f23ac5520a7cf0947';
    var year = Moment().year();
    console.log(year);
    Note
      .find({'user': userId})
      .gte('startTime',new Date(year))
      .populate({path:'holidayType'})
      .sort({'startTime': -1})
      .exec(function(err, notes){
        if(err){
          console.log(err);
        }else{
          var length = notes.length;
          for(var i=0; i<length; i++){
            notes[i].start = Moment(notes[i].startTime).format('YYYY-MM-DD');
        //    console.log("时间 : "+notes[i].start);
          }
          var results = notes.slice(index,index+Count);
          console.log("ok"+notes);
          console.log("ok");
          res.render('reqAllState', {
            title: "请假状态页",
            notes: results,
            currentPage: (p+1),
            totalPage: Math.ceil(notes.length/Count)
          });
        }
      });
};

exports.noteInfo = function(req, res){
  var _user = req.session.user;

  var noteId = req.params.id;

  console.log(noteId);
  Note
    .findOne({"_id": noteId})
    .populate({path:'holidayType'})
    .exec(function(err, _note){
      if(err){
        console.log(err);
      }else{
        _note.start = Moment(_note.startTime).format('YYYY-MM-DD');
        Role
          .findOne({'_id': _user.userRole})
          .exec(function(err, _role){
            res.render('holidayInfo',{
              title: '请假详情',
              note: _note,
              roleName : _role.roleName,
              holidayName: _note.holidayType.holidayName
            });
          });

      }
    });
};

//注销假期
exports.destroy = function(req, res){
    var noteId = req.params.id;

    Note
      .update(
          {'_id': noteId},
          {$set:{'curState': -3}},
          function(err, _note){
            console.log(_note);
            res.render('../success', {
              title: '结果页',
              msg: '销假成功'
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

function _findNotesByManagerId(managerId){
  return  findRoleByUserId(managerId)
  .then(function(role){
      if(role.preState === 0){ // this represents normal user
        return {};
      }
      return Note.findByState(role.preState);
    });
}


exports.findManagerCanHandleNotes = function (req, res, next){
  debugRequest(req);
  //从session 中
  var _user = req.session.user;
  var managerId = _user._id;
  //var managerId = '584fb58932682f19ccade5e8'; // Just for test

  _findNotesByManagerId(managerId)
  .then(function(notes){
    debug('Find all notes by manager preState, notes.length:' + notes.length);
    // return res.send(notes);
    res.render('examine', {
        title: "待审核假期",
        notes: notes
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
}


exports.updateStateByManager = function (req, res, next){
  debugRequest(req);
  //从session 中获取
  var _user = req.session.user;
  var managerId = _user._id;
  //var managerId = '584fb58932682f19ccade5e8'; // Just for test

  var noteId = req.body.noteId;
  var approvedStr = req.body.approved; // seems cannot get boolean from ajax, but can from postman
  var approved = (approvedStr === 'true' || approvedStr === true);

  var newState = 0;

  Note.findById(noteId)
  .then(function(note){
    debug('Found note by noteId %s:\n%s', noteId, note);

    return _updateStateByManager(managerId, note, approved)
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



function judgeUserHolidayInfoByUserId(userId){
	return new Promise (function(resolve) {
		debug('now user id: ' + userId);
		var userHolidayInfo = [true, false, false]; // at work, approvedButNotStart, inHoliday
		var approvedButNotStart = Note.fetchAlreadyApprovedButNotStartByUserId(userId);
		var inHoliday = Note.fetchInHolidayByUserId(userId);
		Promise.all([approvedButNotStart, inHoliday])
		.then(function(notes){
			if(notes[0].length > 0) { // approvedButNotStart, so still at work
				userHolidayInfo[1] = true;
			}
			if(notes[1].length > 0) { // in holiday, not at work
				userHolidayInfo[2] = true;
				userHolidayInfo[0] = false;
			}
			resolve(userHolidayInfo);
		});
	});
}


exports.test2 = function (req, res, next) {
	var userId = '584e1f5d125e0f2bc260a6f4';
	judgeUserHolidayInfoByUserId(userId)
	.then(function(results){
		res.send(results);
	})
	.catch(next);
};




function renderIndexHolidayInfoByUsers(users){
	return new Promise (function (resolve){
		return Promise.all(users.map(function (user) {
				return judgeUserHolidayInfoByUserId(user._id);
		}))
		.then(function(allresults){
			debug('judgeUserHolidayInfoByUserId, length: ' + allresults.length);
			var usersInHoliday = [], usersAtWwork = [], usersAlreadyApprovedButNotStart = [];
			// res.send(allresults);
			for(idx = 0; idx < allresults.length; idx++){
				var userHolidayInfo = allresults[idx];
				if(userHolidayInfo[0] === true) {
					usersAtWwork.push(users[idx]);
				}
				if(userHolidayInfo[1] === true) {
					usersAlreadyApprovedButNotStart.push(users[idx]);
				}
				if(userHolidayInfo[2] === true) {
					usersInHoliday.push(users[idx]);
				}
				if(idx == allresults.length - 1){
					var dataToSend = {
						title : 'index',
						usersAtWwork : usersAtWwork,
						usersInHoliday : usersInHoliday,
						usersAlreadyApprovedButNotStart : usersAlreadyApprovedButNotStart
					};
					resolve(dataToSend);
				}
			}
		});
	});
}


exports.IndexQueryOnePersonHolidayInfo = function (req, res, next) {
	debugRequest(req);
	var userName = req.body.otherPersonName;
	var emptyWhenNoSuchUser = [];
	// var userName = 'a12345';
	User.findLikeUserName(userName) // 模糊查询
	.then(function(users){
		debug('Got users by name like :%s, users:%s', userName, users);
		if(users.length === 0) {
			res.render('index', {title:'index', usersAtWwork:emptyWhenNoSuchUser, usersInHoliday:emptyWhenNoSuchUser, usersAlreadyApprovedButNotStart:emptyWhenNoSuchUser});
		}
		return renderIndexHolidayInfoByUsers(users)
					.then(function(dataToSend){
						res.render('index', {title:'index', usersAtWwork:dataToSend.usersAtWwork, usersInHoliday:dataToSend.usersInHoliday, usersAlreadyApprovedButNotStart:dataToSend.usersAlreadyApprovedButNotStart});
					});
	})
	.catch(next);
};

exports.IndexWithHolidayInfo = function (req, res, next) {
	User.fetch()
	.then(function(users){
		debug('Fetch all users, length:%s', users.length);
		return renderIndexHolidayInfoByUsers(users)
					.then(function(dataToSend){
						res.render('index', {title:'index', usersAtWwork:dataToSend.usersAtWwork, usersInHoliday:dataToSend.usersInHoliday, usersAlreadyApprovedButNotStart:dataToSend.usersAlreadyApprovedButNotStart});
					});
	})
	.catch(next);

};
