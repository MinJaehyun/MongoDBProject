const express = require('express');
const router = express.Router();
const { Comment } = require("../mongoose/model");

// 댓글 생성
router.post("/comment/create", async (req, res) => {
  // author 는 추후 token 으로 변경할 예정
  const { author, article, content } = req.body;
  const comment = await Comment({ author, article, content }).save();
  res.send(comment);
});

// 댓글 삭제
router.delete("/comment/delete", async (req, res) => {
  const { id, author } = req.body;
  const comment = await Comment.deleteOne(
    {
      _id: id,
      author,
    }
  );

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