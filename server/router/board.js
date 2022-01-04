const express = require('express');
const router = express.Router();
const { Article, Board } = require("../mongoose/model");

// 게시판별 게시글 가져오기
router.get("/board/:slug", async (req, res) => {
  const { slug } = req.params;
  const board = await Board.findOne({ slug });

  // board 가 없으면 존재하지 않는 게시판이고, 
  // board 가 있으면 board 에 해당하는 모든 게시글을 가져온다.

  if (!board._id) {
    return res.send({ error: true, msg: "존재하지 않는 게시판", articles: [] })
  }

  const article = await Article.find({ board: board._id });
  res.send({ error: false, msg: "게시글 가져오기 성공", article });
});

// 게시판 생성하기
router.post("/board/create", async (req, res) => {
  const { title, slug } = req.body;
  const newBoard = await Board({ title, slug }).save();
  res.send(newBoard);
});

module.exports = router;
