const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const model = require("../mongoose/model");
const jwt = require("jsonwebtoken");

// POST, /create
router.post("/article/create", async (req, res) => {
  const { board, content, title } = req.body;

  // router/user 에 작성한 token 체크 로직을 활용한다
  const { authorization } = req.headers;

  if (!authorization) return res.send(false);

  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, async (err, data) => {
    if (err) return res.send(err)

    const article = await model.Article({
      author: data.id,
      path: board,
      content,
      title,
    }).save();
    return res.send(article);
  });
});

// GET, /read
router.get("/article/read", async (req, res) => {
  try {
    const article = await model.Article.find({});
    return res.send(article);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({ error: error.message });
  }
});

// GET, /detail/:id 
router.get("/article/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send("invalid articleId");
    const article = await model.Article.findById(id);
    return res.send(article);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({ error: error.message });
  }
});

// PATCH, /update ㅡ FIXME:
router.patch("/article/update", async (req, res) => {
  const { id, author, title, content } = req.body;
  const article = await model.Article.findByIdAndUpdate(
    { _id: id, author },
    { title, content },
    { new: true },
  );
  return res.send(article);
});

// DELETE, HARD DELETE
router.delete("/article/delete/hard", async (req, res) => {
  try {
    const { id, author } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("invalid articleId");
    }
    else if (!mongoose.isValidObjectId(author)) {
      return res.status(400).send("invalid authorId");
    }

    const article = await model.Article.findByIdAndDelete({
      _id: id,
      author,
    });
    return res.send(article);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({ error: error.message });
  }
});

// article SOFT DELETE
router.delete("/article/delete/soft", async (req, res) => {
  try {
    const { id, author } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send("invalid articleId");
    }
    else if (!mongoose.isValidObjectId(author)) {
      return res.status(400).send("invalid authorId");
    }

    const article = await model.Article.findByIdAndUpdate(
      {
        _id: id,
        author,
      },
      {
        deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      },
    )
    return res.send(article);
  } catch (error) {
    console.log('error: ', error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
