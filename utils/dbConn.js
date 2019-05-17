const mongoose = require('mongoose');

const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const uri = process.env.MONGODB_URI;

const connectionString = `mongodb://${user}:${password}@${uri}`;

mongoose.connect(connectionString, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('MongoDB Connected'));

module.exports = db;
