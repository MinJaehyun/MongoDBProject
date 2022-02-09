// model => server.js 로 이동
// model 생성은 schema 에서 하도록 설정 변경.

// const mongoose = require('mongoose');
// const schema = require("./schema");

// require("dotenv").config();

// const db = mongoose.connection;
// const model = (() => {
//   try {
//     // db.on
//     db.on('error', console.error);
//     db.on('open', () => {
//       console.log(`connected mongoDB!`);
//     });

//     // mongoDB connect
//     mongoose.connect(
//       `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.gnquy.mongodb.net/refactoringProject?retryWrites=true&w=majority`
//     );

//     mongoose.set('debug', true);

//     // schema 를 가져와 model 로 생성
//     const model = {};
//     for (let key in schema) {
//       model[key] = mongoose.model(key, schema[key]);
//     }
//     return model;
//   } catch (error) {
//     console.log({ error: error.message });
//   }
// })();

// module.exports = model;