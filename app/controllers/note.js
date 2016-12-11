var debug = require('debug')('attendance:noteController');

var NoteModel = require('../models/note');

var UserModel = require('../models/user');

var NoteSchema = require('../schemas/note');


var Promise = require("bluebird");

var debugNewRequest = '\n\n\n\n\n\n\n\n\n\n\n\n'; // sepearate new debug with some newlines

function setState(_note){
  if(_note.timelength < 1){
    _note.highState = 10;
  }else{
    _note.highState = 30;
  }
  _note.state = 1;
  return _note;
}

exports.new = function(req, res, next){
  var _note = req.body.note;

  debug(debugNewRequest + 'Get params from front,note:\n' + JSON.stringify(_note));

  var note = new NoteModel(_note);

  setState(note);

  NoteModel.create(note)
  .then(function(){
    debug('Create new note succeeded');
    return res.send(note);
  })
  .catch(next);
};


function findRoleByUserId(userId){
  return UserModel.findById(userId)
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
    NoteModel.findByState(role.preState)
    .then(function(notes){
      debug('Find all notes by manager preState, notes.length:' + notes.length);
      return res.send(notes);
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

  NoteModel.findById(noteId)
  .then(function(note){
    debug('Found note by noteId %s:\n%s', noteId, note);

    _updateStateByManager(managerId, note, approved)
    .then(function(newState){
      var conditions = {_id : note._id};
      var update = { $set : {state:newState}};
      var options    =  { multi: false };
      return NoteModel.update(conditions, update, options)
      .then(function(changedInfo){
        debug('Update note info succeeded');
        res.send(changedInfo);
      });
    });
  })
  .catch(next);
};
