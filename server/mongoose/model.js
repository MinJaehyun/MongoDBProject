const mongoose = require('mongoose');
const schema = require("./schema");

require("dotenv").config();

const db = mongoose.connection;
const model = (() => {
  // db.on
  db.on('error', console.error);
  db.on('open', () => {
    console.log(`connected mongoDB!`);
  });

  // mongoDB connect
  mongoose.connect(
    `mongodb+srv://ch13admin:6954402km@cluster0.gnquy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  );

  // schema 를 가져와 model 로 생성
  const model = {};
  for (let key in schema) {
    model[key] = mongoose.model(key, schema[key]);
  }
  return model;

})();

module.exports = model;