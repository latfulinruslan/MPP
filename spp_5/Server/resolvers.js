const {getAllUserNotes, getNote, addNote, deleteNote, updateNote, completeNote} = require('./controllers/controllerNotes')

module.exports.resolvers = {
  getNote: (request) => { let a = getNote(request.id); console.log(a); return a},
  getAllUserNotes: (request) => getAllUserNotes(request.userId),

  addNote: (request) => addNote(request.data),
  completeNote: (request) => completeNote(request.id, request.status),
  updateNote: (request) => updateNote(request.id, request.data),
  deleteNote: (request) => deleteNote(request.id)
}