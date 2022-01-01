const express = require("express");
const cors = require("cors");
const { Article } = require("./mongoose/model");
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
app.get("detail/:id", async (req, res) => {
  // article 한개를 가져오기
  const { id } = req.params;
  const article = await Article.findById(id);
  console.log('article: ', article);
});

// listen
app.listen(PORT, () => {
  console.log(`App listen is http://localhost:${PORT}`);
});