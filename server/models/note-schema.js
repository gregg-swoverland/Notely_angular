var db = require('../config/db');

// Define db schema
var NoteSchema = db.Schema({
  title: String,
  body_html: String,
  body_text: String,
  updated_at: { type: Date, default: Date.now }
});

// Will run the function before every save
NoteSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = NoteSchema;
