var ourUrl = 'http://localhost:3000/';


function change_note_state(noteId, approved){
  console.log('noteId:%s, approved:%s\n', noteId, approved);
  //- {"managerId":"58493581f210182bbc28713f","noteId":"58493eabd5d47f3948fe85ba","approved":true}
  $.ajax({
    url: ourUrl + 'notes/manager',
    method: 'POST',
    data: {
      "noteId":noteId,
      "approved":approved
    },
    dataType: 'json'
  })
  .done(function (data) {
      changedInfo = data;
      console.log(changedInfo);
      window.location.reload(); // THIS IS NOT WHAT AJAX DO ~~
  }).fail(function (jqXHR, textStatus) {
      console.log('Error: ' + jqXHR.status);
  });
}




function testNoteChange(){
  var noteId = '5853fab72e5baac361a430d7';
  var approved = true;

  change_note_state(noteId, approved);
}


function ajaxCodeDemo(){
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
