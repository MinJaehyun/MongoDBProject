const express = require('express');
const router = express.Router();
const { Reply } = require("../mongoose/model");
const jwt = require("jsonwebtoken");

// 대댓글 생성
router.post("/reply/create", async (req, res) => {
  const { comment, content } = req.body;
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
    const reply = await Reply({ author: data.id, comment, content }).save();
    res.send(reply);
  });

});

// 대댓글 변경
router.patch("/reply/update", async (req, res) => {
  // 대댓글을 변경 시 필요한것은?
  const { id, author, content } = req.body;
  const reply = await Reply.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      content
    },
    {
      new: true,
    }
  )
  res.send(reply);
});

// 대댓글 HARD DELETE
router.delete("/reply/delete/hard", async (req, res) => {
  const { id, author } = req.body;
  const reply = await Reply.deleteOne({ _id: id, author });
  res.send(reply);
});

// 대댓글 SOFT DELETE
router.delete("/reply/delete/soft", async (req, res) => {
  const { id, author } = req.body;
  const reply = await Reply.findOneAndUpdate(
    {
      _id: id,
      author,
    },
    {
      deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    },
  )
  res.send(reply);
});

module.exports = router;