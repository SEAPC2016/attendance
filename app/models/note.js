var mongoose = require('mongoose');
var NoteSchema = require('../schemas/note');
var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;
