var ourUrl = 'http://localhost:3000/'


function change_note_state(managerId, noteId, approved){
  console.log('managerId:%s, noteId:%s, approved:%s\n', managerId, noteId, approved);
  //- {"managerId":"58493581f210182bbc28713f","noteId":"58493eabd5d47f3948fe85ba","approved":true}
  $.ajax({
    url: ourUrl + 'notes',
    method: 'POST',
    data: {
      "managerId":managerId,
      "noteId":noteId,
      "approved":approved
    },
    dataType: 'json'
  })
  .done(function (data) {
      notes = data;
      console.log(data);
  }).fail(function (jqXHR, textStatus) {
      console.log('Error: ' + jqXHR.status);
  });
}



function test(){
  //- $.get('https://api.github.com',
  //-   {},
  //-   "json"
  //- )
  $.ajax({
    url: 'https://api.github.com',
    method: 'GET',
    data: { },
    dataType: 'json'
  })
  .done(function(data){
    console.log(data);
  })
  .fail(function (jqXHR, textStatus) {
      alert('Error: ' + jqXHR.status);
  });
}

function testNoteChange(){
  // {"managerId":"584fb58932682f19ccade5e8","noteId":"584e0a9f19025d0fd280df84","approved":true}
  var managerId = '584fb58932682f19ccade5e8';
  var noteId = '584e0a9f19025d0fd280df84';
  var approved = true;

  change_note_state(managerId, noteId, approved);
}
