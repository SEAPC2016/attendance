var NoteModel = require('../models/note');

var UserModel = require('../models/user');

var NoteSchema = require('../schemas/note');

function setState(_note){
  if(_note.timelength < 1){
    _note.highState = 10;
  }else{
    _note.highState = 30;
  }
  _note.state = 1;
  return _note;
}


exports.new = function(req, res){
  var _note = req.body.note;
  var note = new NoteSchema(_note);

  setState(note);

  // note.save(function(err, note){
  //   if(err){
  //     console.log(err);
  //   }else{
  //     res.send(note);
  //   }
  // });

  NoteModel.create(note, function(err, note){
    if(err){
      console.log(err);
    }else{
      res.send(note);
    }
  });


};


exports.findByManagerId = function (req, res){

  // var managerId = "58493581f210182bbc28713f";
  var managerId = req.params.managerId;

  UserModel.findById(managerId, function(err, user){
       if (err) {
           console.log("Error:" + err);
       }
       else {
          //  return user;
          console.log(user);
          var role = user.userRole;
          console.log(role);

          NoteModel.findByState(role.preState ,function(err, notes){
            if(err){
              console.log(err);
            }else{
              res.send(notes);
            }
          });
       }
   });
};


function _updateStateByManager(managerId, note, res){ // this way of `res` is ugly.

  UserModel.findById(managerId, function(err, user){
       if (err) {
           console.log("Error:" + err);
       }
       else {
          //  return user;
          console.log(user);
          var role = user.userRole;
          console.log(role);

          if (role.postState === note.highState){
            note.state = -1;
          }
          else{
            note.state = role.postState;
          }

          // SAVE NOTE
          var conditions = {_id : note._id};
          var update = { $set : {state:note.state}}; // !!!!! Well, status and state
          // var update = {state : 0};
          var options    =  { multi: false };
          NoteModel.update(conditions, update, options,function(err, changed){
              if(err) {
                  console.log(err);
              } else {
                  console.log('update ok!');
                  res.send(changed);
              }
          });

       }
   });

}


exports.updateStateByManager = function (req, res){

  var managerId = req.body.managerId;
  var noteId = req.body.noteId;
  var approved = req.body.approved;

  console.log(managerId, noteId, approved);

  NoteModel.findById(noteId, function(err, note){
    if (err) {
      console.log("Error:" + err);
    }
    else{
      console.log(note);
      console.log(note._id);
      if (approved === false) {
        var conditions = {_id : note._id};
        var update = { $set : {state:0}}; // !!!!! Well, status and state
        // var update = {state : 0};
        var options    =  { multi: false };
        NoteModel.update(conditions, update, options,function(err, changed){
            if(err) {
                console.log(err);
            } else {
                console.log('update ok!');
                res.send(changed);
            }
        });


      } // do not approve
      else{ // approve
        console.log("Approved");
        _updateStateByManager(managerId, note, res);
      }


    }
  });
};
