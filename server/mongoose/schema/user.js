const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  nickname: { type: String, required: true },
  salt: { type: String, required: true },
}, { timestamps: true });

// password 가상 선택자
UserSchema.virtual("password").set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(password);
});

// salt function
UserSchema.method("makeSalt", function () {
  return Math.round(new Date().valueOf() * Math.random());
});

// 해시된 비밀번호 생성 함수
UserSchema.method("encryptPassword", function (plainPassword) {
  return crypto.createHmac("sha256", this.salt).update(plainPassword).digest("hex");
});

// UserSchema authenticate function
UserSchema.method("authenticate", function (plainPassword) {
  const inputPassword = this.encryptPassword(plainPassword);
  return inputPassword === this.hashedPassword; // boolean
});

const User = mongoose.model("User", UserSchema)

module.exports = User;
