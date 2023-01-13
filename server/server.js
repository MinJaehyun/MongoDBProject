const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { article, board, comment, reply, user } = require('./router');
require('dotenv').config();

const PORT = 8080;
const SECRET = 'jwt@secret@jh82';

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set
app.set('jwt-secret', SECRET);
app.set('view engine', 'ejs');

// router
app.use(article);
app.use(board);
app.use(comment);
app.use(reply);
app.use(user);

// db.on
const db = mongoose.connection;
db.on('error', console.error);
db.on('open', () => {
  console.log(`connected mongoDB!`);
});

// mongoDB Atlas connect
mongoose.connect(
  `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.gnquy.mongodb.net/refactoringProject?retryWrites=true&w=majority`
);

// mjhweb.xyz 접근 시, home.ejs 출력
app.get("/", (req, res) => {
  res.render('home.ejs');
});

// dev, prod, test 로 구분하여 접근 설정
if (process.env.NODE_ENV == 'development') {
  app.listen(PORT, () => {
    console.log(`development App listen is ${PORT}`);
  });
} else if (process.env.NODE_ENV == 'test') {
  console.log('test!');
} else {
  app.listen(PORT, () => {
    console.log(`production App listen is ${PORT}`);
  });
}

// 에러 중복 처리 구문
/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
  return res.status(500).json({ message: error.message })
})

module.exports = app;
