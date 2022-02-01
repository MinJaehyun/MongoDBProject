const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Comment } = require("../mongoose/model");
const jwt = require("jsonwebtoken");

// 댓글 생성
router.post("/comment/create", async (req, res) => {
  try {
    const { articleId, content } = req.body;
    if (!articleId || !content) return res.status(400).send({ err: "Both articleId and content is required" });

    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({ msg: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      if (err) return res.send(err);
      const comment = await Comment({ author: data.id, articleId, content }).save();
      return res.send(comment);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 변경
router.patch("/comment/update", async (req, res) => {
  try {
    const { commentId, author, content } = req.body;
    if (!commentId || !author || !content) return res.status(400).send({ err: "commentId and author and content is required" });

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 개별 댓글 조회
router.get("/comment/detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send({ err: "commentDetailId is invalid" });
    const commentDetail = await Comment.findById(id);
    return res.send(commentDetail);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 전체 조회
router.get("/comment/read", async (req, res) => {
  try {
    const allComment = await Comment.find({});
    return res.send(allComment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 HARD DELETE
router.delete("/comment/delete/hard", async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both commentId and authorId is required" });
    const comment = await Comment.deleteOne(
      {
        _id: id,
        author,
      }
    );
    return res.send(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

// 댓글 SOFT DELETE
router.delete("/comment/delete/soft", async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both commentId and authorId is required" });
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
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = router;
