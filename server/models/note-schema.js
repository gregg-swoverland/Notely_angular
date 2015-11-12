var sanitizeHtml = require('sanitize-html');
var htmlToText = require('html-to-text');
var db = require('../config/db');

// Define db schema
var NoteSchema = db.Schema({
  title: String,
  body_html: String,
  body_text: String,
  user: { type: db.Schema.Types.ObjectId, ref: 'User' },
  updated_at: { type: Date, default: Date.now }
});

// Will run the function before every save
NoteSchema.pre('save', function(next) {
  this.body_html = sanitizeHtml(this.body_html);
  this.body_text = htmlToText.fromString(this.body_html);
  this.updated_at = new Date();
  next();
});

module.exports = NoteSchema;
