const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Board = new Schema({
  // title, url, createdAt
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  Board,
};