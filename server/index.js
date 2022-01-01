const express = require("express");
const cors = require("cors");
const model = require("./mongoose/model");
const app = express();
const PORT = 3000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test method
app.get("/", (req, res) => {
  res.send("Server Run!");
});

// test mongoose connect
app.post("/create", async (req, res) => {
  // article 전체 가져오기
  const { title, content } = req.body;
  const article = await model.Article({
    title,
    content,
  }).save();
  console.log('article: ', article);
  res.send(article);
});

// listen
app.listen(PORT, () => {
  console.log(`App listen is http://localhost:${PORT}`);
});