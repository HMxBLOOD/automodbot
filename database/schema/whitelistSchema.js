const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  id: Number,
});

module.exports = mongoose.model('whitelistSchema', schema);