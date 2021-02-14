const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  word: String,
});

module.exports = mongoose.model('bannedWordsSchema', schema);