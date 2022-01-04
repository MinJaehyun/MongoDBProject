const express = require('express');
const router = express.Router();
const { Comment } = require("../mongoose/model");
const jwt = require("jsonwebtoken");

// 댓글 생성
router.post("/comment/create", async (req, res) => {
  const { article, content } = req.body;
  const { authorization } = req.headers;

  if (!authorization) {
    return res.send({
      error: true,
      msg: "토큰이 존재하지 않음",
    });
  }

  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, async (err, data) => {
    if (err) {
      res.send(err);
    }

    const comment = await Comment({ author: data.id, article, content }).save();
    res.send(comment);
  });
});


// 댓글 HARD DELETE
router.delete("/comment/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const comment = await Comment.deleteOne(
    {
      _id: id,
      author,
    }
  );

  res.send(comment);
});

// 댓글 SOFT DELETE
router.delete("/comment/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const comment = await Comment.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    },
  )
  res.send(comment);
});

// 댓글 변경
router.patch("/comment/update", async (req, res) => {
  const { id, author, content } = req.body;
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
  console.log(comment);
  res.send(comment._id ? true : false);
});

// 댓글 조회
// router.get("/comment/read", (req, res) => {

// });

// 댓글 전체 조회

module.exports = router;