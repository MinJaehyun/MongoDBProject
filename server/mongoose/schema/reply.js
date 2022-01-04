const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Reply = new Schema({
  // author, content, createdAt, thumbupCount, comment
  // static
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  // variable
  thumbupCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  // option
  replyImgAddress: { type: String },
});

module.exports = Reply;
