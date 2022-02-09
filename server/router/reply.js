const express = require('express');
const router = express.Router();
const replyController = require("../controller/reply");

// 대댓글 생성 
router.post("/reply/create", replyController.createReply);

// 대댓글 전체 조회 
router.get("/reply/read", replyController.readReply);

// 대댓글 변경 
router.patch("/reply/update", replyController.updateReply);

// 대댓글 HARD DELETE 
router.delete("/reply/delete/hard", replyController.deleteHardReply);

// 대댓글 SOFT DELETE 
router.delete("/reply/delete/soft", replyController.deleteSoftReply);

module.exports = router;
