const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');

const User = require('./User');

const WatchRequest = new mongoose.Schema({
  user: User,
  url: String,
  keywords: [String],
});

WatchRequest.plugin(findOrCreate);

module.exports = mongoose.model('WatchRequest', WatchRequest);
