const express = require("express");
const cors = require("cors");
const app = express();

const { article, board, comment, reply, user } = require("./router");
const PORT = 3000;
const SECRET = "jwt@scret@jh82";

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.set
app.set("jwt-secret", SECRET);

// test method
app.get("/", (req, res) => {
  res.send("Server Run!");
});

// router
app.use(article);
app.use(board);
app.use(comment);
app.use(reply);
app.use(user);


// listen
app.listen(PORT, () => {
  console.log(`App listen is http://localhost:${PORT}`);
});