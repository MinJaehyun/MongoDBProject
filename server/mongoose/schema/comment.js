const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comment = new Schema({
  // content, articleImgAddress, createAt, author, article, thumbupCount
  // static
  content: { type: String, required: true },
  createAt: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectID, ref: "User" },
  article: { type: Schema.Types.ObjectID, ref: "Article" },
  // variable
  thumbupCount: { type: Number, default: 0 },
  // option
  articleImgAddress: { type: String },
});

module.exports = {
  Comment,
}