const express = require('express');
const router = express.Router();
const model = require("../mongoose/model");

// POST, /create
router.post("/article/create", async (req, res) => {
  const { board, content, title } = req.body;
  const article = await model.Article({
    path: board,
    content,
    title,
  }).save();
  console.log('article: ', article);
  res.send(article);
});

// GET, /read
router.get("/article/read", async (req, res) => {
  const article = await model.Article.find({});
  res.send(article);
});

// GET, /detail/:id 
router.get("/article/detail/:id", async (req, res) => {
  const { id } = req.params;
  const article = await model.Article.findById(id);
  res.send(article);
});

// PATCH, /update
router.patch("/article/update", async (req, res) => {
  const { id, author, title, content } = req.body;
  const article = await model.Article.findByIdAndUpdate(
    { _id: id, author },
    { title, content },
    { new: true },
  );
  res.send(article);
});

// DELETE, HARD DELETE
router.delete("/article/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const article = await model.Article.deleteOne({
    _id: id,
    author,
  });
  res.send(article);
});

// article SOFT DELETE
router.delete("/article/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const article = await Article.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    },
  )
  res.send(article);
});

module.exports = router;