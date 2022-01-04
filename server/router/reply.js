const express = require('express');
const router = express.Router();
const { Reply } = require("../mongoose/model");

// 대댓글 생성
router.post("/reply/create", async (req, res) => {
  const { author, comment, content } = req.body;
  const reply = await Reply({ author, comment, content }).save();

  res.send(reply._id ? true : false);
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