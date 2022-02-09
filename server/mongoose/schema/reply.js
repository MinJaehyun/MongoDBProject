const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  // author, content, createdAt, thumbupCount, comment
  // static
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  content: { type: String, required: true },

  // variable
  thumbupCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  // option
  replyImgAddress: { type: String },
}, { timestamps: true });

const Reply = mongoose.model("Reply", ReplySchema)

module.exports = Reply;
