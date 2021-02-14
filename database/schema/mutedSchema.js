const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: String,
  time: String,
  reason: String,
  by: String
});

module.exports = mongoose.model('mutedSchema', schema);