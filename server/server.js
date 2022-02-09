const express = require("express");
const cors = require("cors");
const app = express();

const { article, board, comment, reply, user } = require("./router");
const PORT = 8080;
const SECRET = "jwt@scret@jh82";

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set
app.set("jwt-secret", SECRET);

// router
app.use(article);
app.use(board);
app.use(comment);
app.use(reply);
app.use(user);

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>mongoDBProject APIs</title>
</head>
<body>
  <h1>
  <a href="https://documenter.getpostman.com/view/11441469/UVeFP77D" style="text-decoration:none">LINK: API 를 참조하여 호출 해주세요!!!</a>
  </h1>
</body>
</html>
`;

// test method
app.get("/", (req, res) => {
  res.send(html);
});

if (process.env.NODE_ENV == 'development') {
  console.log('development!');
} else if (process.env.NODE_ENV == 'test') {
  console.log('test!');
} else {
  app.listen(PORT, () => {
    console.log(`production App listen is ${PORT}`);
  });
}

/* eslint-disable no-unused-vars */
app.use((error, req, res, next) => {
  res.status(500).json({ message: error.message })
})
