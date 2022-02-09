const express = require('express');
const router = express.Router();
// const { Article, Board } = require("../mongoose/schema");
const boardController = require("../controller/board");

// 게시판별 게시글 가져오기
router.get("/board/:slug", boardController.readBoard);

// 게시판 생성
router.post("/board/create", boardController.createBoard);

// TODO: 나중에 카테고리 변경 및 완전 삭제 APIs 를 관리자용으로 만들기

module.exports = router;
