var Note = require('../models/note');

exports.new = function(req, res){
  var _note = req.body.note;
  var note = new Note(_note);

  note.save(function(err, note){
      if(err){
        console.log(note);
      }else{
        res.send(note);
      }
  });
};
