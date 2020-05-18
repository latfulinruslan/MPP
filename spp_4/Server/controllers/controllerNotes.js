const fs = require("fs-extra");
const files = require('./controllerFiles');
const notesDB = "notes.json";

function GetNote(noteId) {
	let content = fs.readFileSync(notesDB, "utf8");
	let notes = JSON.parse(content);
	let note = null;

	for (var i = notes.length - 1; i >= 0; i--) {
		if (notes[i].id == noteId) {
			note = notes[i];
			break;
		}
	}

	return note;
}

function GetNotes() {
	let data = "";
	let notes = [];

	try {
		data = fs.readFileSync(notesDB, "utf8");
	} catch(error) {
		console.error(error);	
	}

	try {
		notes = JSON.parse(data);
	} catch(error) {
		console.error(error);
		fs.writeFileSync(notesDB, '[]');
		notes = [];
	}

	return notes;
}

function RewriteNotes(notes) {
	let data = JSON.stringify(notes);
	fs.writeFileSync(notesDB, data);
}

module.exports.getNote = function(id) {
	return GetNote(id);
}

module.exports.getAllUserNotes = function(userId) {
	return GetNotes().filter(note => note.userId == userId);
}

module.exports.complete = function(id, status) {
	let notes = GetNotes();

	for (var i = notes.length - 1; i >= 0; i--) {
		if (notes[i].id == id) {
			notes[i].complete = status;
			console.log('COMPLETE STATUS CHANGED', notes[i]);
			break;
		}
	}
	
	RewriteNotes(notes);
	return notes;
}

module.exports.addNote = function(userId, data) {
	let notes = GetNotes();
	let note = {
		id: null,
		userId: userId,
		title: data.title,
		content: data.content,
		date: data.date,
		complete: false
	};

	let maxId = Math.max.apply(Math, notes.map(parseNote => parseNote.id));

	if (maxId == Infinity || maxId == -Infinity) {
		maxId = 0;
	}

	note.id = maxId + 1;
	notes.push(note);
	console.log('ADDED', note);
	RewriteNotes(notes);
	return note;
}

module.exports.updateNote = function(id, data) {
	let notes = GetNotes();
	let updated = false;
	console.log(id, data);
	for (var i = notes.length - 1; i >= 0; i--) {
		if (notes[i].id == id) {
			notes[i].title = data.title;
			notes[i].content = data.content;
			notes[i].date = data.date;
			updated = true;
			console.log('UPDATED', notes[i]);
			break;
		}
	}	
	
	RewriteNotes(notes);
	return updated;
}

module.exports.deleteNote = function(id) {
    let notes = GetNotes();
    let index = -1;

    for(var i = 0; i < notes.length; i++) {
        if(notes[i].id == id){
			console.log('DELETED', notes[i]);
            index = i;
            break;
        }
    }

    if(index > -1){
        notes.splice(index, 1)[0];
		RewriteNotes(notes);
		files.deleteDir(id);
        return true;
    } else {
        return false;
    }
}