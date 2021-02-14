const mongoose = require('mongoose');
const mutedSchema = require('./schema/mutedSchema');
const whitelistSchema = require('./schema/whitelistSchema.js')
const bannedWordsSchema = require('./schema/bannedWordsSchema.js')

module.exports = {
  mutedSchema: require('./schema/mutedSchema'),
  whitelistSchema: require('./schema/whitelistSchema.js'),
  bannedWordsSchema: require('./schema/bannedWordsSchema.js'),


  async connect(uri) {
    await mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      }
    );
    console.log('Connected to database!');
  },
  bannedwords: {
    async addWord(word) {
      const res = await bannedWordsSchema.findOneAndUpdate(
        {
          word: word,
        },
        {
          word: word,
        },
        {
          upsert: true
        }
      );
      return res;
    },
    async delWord(word) {
      const res = await bannedWordsSchema.deleteOne({ word: word });
      return res;
    },
    async check(word) {
      const res = await bannedWordsSchema.findOne({ word: word });
      return res;
    },
  },
  whitelist: {
    async addUser(id) {
      const res = await whitelistSchema.findOneAndUpdate(
        {
          id: id,
        },
        {
          id: id,
        },
        {
          upsert: true
        }
      );
      return res;
    },
    async delUser(id) {
      const res = await whitelistSchema.deleteOne({ id: id });
      return res;
    },
    async check(id) {
      const res = await whitelistSchema.findOne({ id: id });
      return res;
    },
  },
  mod: {
    async set(id, time, reason) {
      const res = await mutedSchema.findOneAndUpdate(
        {
          id: id,
          time: time,
          reason: reason
        },
        {
          id: id,
          muted: true,
          time: time,
          reason: reason
        },
        {
          upsert: true
        }
      );
      return res;
    },
    async delete(id) {
      const res = await mutedSchema.deleteOne({ id: id });
      return res;
    },
    async list() {
      const data = await mutedSchema.find();
      return data;
    },
    async get(id) {
      const res = await mutedSchema.findOne({ id: id });
      return res;
    },
  }
};