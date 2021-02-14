const mongoose = require('mongoose');
const mutedSchema = require('./schema/mutedSchema');
const whitelistSchema = require('./schema/whitelistSchema.js')
const bannedWordsSchema = require('./schema/bannedWordsSchema.js')
const simpSchema = require('./schema/simpSchema.js')

module.exports = {
  mutedSchema: require('./schema/mutedSchema'),
  whitelistSchema: require('./schema/whitelistSchema.js'),
  bannedWordsSchema: require('./schema/bannedWordsSchema.js'),
  simpSchema: require('./schema/simpSchema.js'),

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
  simp: {
    async addSimp(user, person) {
      const res = await simpSchema.findOneAndUpdate(
        {
          user: user,
          for: person,
        },
        {
          user: user,
          for: person,
        },
        {
          upsert: true
        }
      );
      return res;
    },
    async delSimp(user) {
      const res = await simpSchema.deleteOne({ user: user });
      return res;
    },
    async check(user) {
      const res = await simpSchema.findOne({ user: user });
      return res;
    },
    async list() {
      const data = await simpSchema.find();
      return data;
    },
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
    async set(id, time, reason, by) {
      const res = await mutedSchema.findOneAndUpdate(
        {
          id: id,
          time: time,
          reason: reason,
          by: by
        },
        {
          id: id,
          muted: true,
          time: time,
          reason: reason,
          by: by
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