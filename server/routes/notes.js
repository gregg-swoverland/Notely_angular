var router = require('express').Router();
var Note = require('../models/note');

// List all notes
router.get('/', function(req, res) {
  // Can use .sort({ updated_at: -1 }) and Mongoose will translate
  Note.find().sort({ updated_at: 'desc' }).then(function(notes){
    res.json(notes);
  });
});

router.post('/', function(req, res) {
  var note = new Note({
    title: req.body.note.title,
    body_html: req.body.note.body_html
  });
  note.save().then(function(noteData) {
    res.json({
      message: 'Successfully saved note.',
      note: noteData
    })
  });
});

// update an existing note
router.put('/:id', function(req, res) {
  Note.findOne({ _id: req.params.id }).then(function(note) {
    note.title = req.body.note.title;
    note.body_html = req.body.note.body_html;
    note.save().then(function() {
      res.json({
        message: 'Your changes have been saved.',
        note: note
      });
    });
  });
});

router.delete('/:id', function(req, res) {
  Note.findOne({ _id: req.params.id }).then(function(note) {
    note.remove().then(function() {
      res.json({
        message: "Note is deleted.",
        note: note
      })
    })
  });
});

module.exports = router;
