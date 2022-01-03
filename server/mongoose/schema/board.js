const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Board = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = Board;
