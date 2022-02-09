const { Article, Board } = require("../mongoose/schema");  // index.js - Article

exports.readBoard = async (req, res) => {
  try {
    const { slug } = req.params;
    const board = await Board.findOne({ slug });
    // board 가 없으면 존재하지 않는 게시판이고, board 가 있으면 board 에 해당하는 모든 게시글을 가져온다.
    if (!board) return res.status(400).send({ err: "존재하지 않는 게시판", articles: [] })

    const articles = await Article.find({ board: board._id });
    return res.send({ err: "게시글 가져오기 성공", articles });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.createBoard = async (req, res) => {
  try {
    const { title, slug } = req.body;
    if (!title) return res.status(400).send({ err: "title is required" });
    if (!slug) return res.status(400).send({ err: "slug is required" });

    const newBoard = await Board({ title, slug }).save();
    return res.status(201).send(newBoard);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};