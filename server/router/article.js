const express = require('express');
const router = express.Router();
const articleController = require("../controller/article");

// POST, /create - router
router.post("/article/create", articleController.createArticle)

// GET, /read
router.get("/article/read", articleController.readArticle);

// GET, /detail/:id 
router.get("/article/detail/:id", articleController.getArticleById);

// PATCH, /update
router.patch("/article/update", articleController.updateArticle);

// DELETE, HARD DELETE
router.delete("/article/delete/hard", articleController.hardDeleteArticle);

// article SOFT DELETE
router.delete("/article/delete/soft", articleController.softDeleteArticle);

module.exports = router;
