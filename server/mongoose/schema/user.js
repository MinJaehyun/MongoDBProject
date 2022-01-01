const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  nickname: { type: String, required: true },

  // TODO: required: true 제거하고 실행하면 어찌되는지? 
  createAt: { type: String, default: Date.now },
});

module.exports = User;