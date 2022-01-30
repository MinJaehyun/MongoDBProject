const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Article = new Schema({
  // static data
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  content: { type: String, required: true },
  // 게시글은 게시판에 속하므로 게시글에서 게시판을 참조한다
  board: { type: Schema.Types.ObjectId, ref: "Board" },

  // variable data
  viewCount: { type: Number, default: 0 },
  thumbupCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  deleteTime: { type: Number, default: 0 },

  // option data
  mention: { type: Schema.Types.ObjectId, ref: "User" },
  articleImgAddress: { type: String },
}, { timestamps: true });

Article.plugin(AutoIncrement, { inc_field: 'key' });

module.exports = Article; 
