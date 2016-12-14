//app.js

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.get('/note', function(req, res){
  var msg = {
    curState:10,
    msg:'部门经理已批准'
  };
  notifyNoteChange(msg);
  res.send(msg);
});

app.get('/notes_to_deal', function(req, res){
  var msg = {
    notes_length: 10
  };
  notifyNotesLength(msg);
  res.send(msg);
});



function notifyNoteChange(msg){
  console.log('msg to return:', msg);
  io.emit('note changed', msg);
}

function notifyNotesLength(msg){
  console.log('msg to return:', msg);
  io.emit('note to deal', msg);
}


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});

app.set('port', process.env.PORT || 3000);

var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});
