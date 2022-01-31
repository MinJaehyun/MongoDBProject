const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Comment } = require("../mongoose/model");
const jwt = require("jsonwebtoken");

// 댓글 생성
router.post("/comment/create", async (req, res) => {
  try {
    const { article, content } = req.body;
    if (!article | !content) return res.status(400).send({ err: "Both article and content is required" });

    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({ msg: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      if (err) return res.send(err);
      const comment = await Comment({ author: data.id, article, content }).save();
      return res.send(comment);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 댓글 변경
router.patch("/comment/update", async (req, res) => {
  try {
    const { id, author, content } = req.body;
    if (!id | !author | !content) return res.status(400).send({ err: "content is required" });

    const comment = await Comment.findOneAndUpdate(
      {
        _id: id,
        author,
      },
      {
        content
      },
      {
        new: true,
      },
    )
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 개별 댓글 조회
router.get("/comment/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send({ err: "invalid commentDetailId" });
    const commentDetail = await Comment.findById(id);
    return res.send(commentDetail);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 댓글 전체 조회
router.get("/comment/read", async (req, res) => {
  try {
    const allComment = await Comment.find({});
    return res.send(allComment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 댓글 HARD DELETE
router.delete("/comment/delete/hard", async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id | !author) return res.status(400).send({ err: "Both comment_id and author_id is required" });
    const comment = await Comment.deleteOne(
      {
        _id: id,
        author,
      }
    );
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

// 댓글 SOFT DELETE
router.delete("/comment/delete/soft", async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id | !author) return res.status(400).send({ err: "Both comment_id and author_id is required" });
    const comment = await Comment.findOneAndUpdate(
      {
        _id: id,
        author,
      },
      {
        deleteTime: new Date().getTime() + 1 // 30 * 24 * 60 * 60 * 1000,
      },
    )
    return res.send(comment);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;
