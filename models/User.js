const mongoose = require('mongoose');
const findOrCreate = require('mongoose-find-or-create');

const User = new mongoose.Schema({
  psid: {
    type: String,
    index: true,
  },
});

User.plugin(findOrCreate);

module.exports = mongoose.model('User', User);
