const express = require('express');
const router = express.Router();
const commentController = require("../controller/comment");

// 댓글 생성
router.post("/comment/create", commentController.createComment);

// 댓글 변경
router.patch("/comment/update", commentController.updateComment);

// 개별 댓글 조회
router.get("/comment/detail/:id", commentController.detailComment);

// 댓글 전체 조회
router.get("/comment/read", commentController.readComment);

// 댓글 HARD DELETE
router.delete("/comment/delete/hard", commentController.deleteHardComment);

// 댓글 SOFT DELETE
router.delete("/comment/delete/soft", commentController.deleteSoftComment);

module.exports = router;
