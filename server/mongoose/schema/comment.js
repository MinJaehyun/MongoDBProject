const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  // content, articleImgAddress, createAt, author, article, thumbupCount
  // static
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectID, ref: "User" },
  article: { type: Schema.Types.ObjectID, ref: "Article" },
  // variable
  thumbupCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  // option
  articleImgAddress: { type: String },
}, { timestamps: true });

const Comment = mongoose.model("Comment", CommentSchema)

module.exports = Comment;
