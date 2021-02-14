const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: String,
  for: String,
});

module.exports = mongoose.model('simpSchema', schema);