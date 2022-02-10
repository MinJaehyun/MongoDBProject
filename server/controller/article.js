const { Article } = require("../mongoose/schema");  // index.js - Article
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.createArticle = async (req, res, next) => {
  try {
    const { board, content, title } = req.body;
    if (!board || !content || !title) return res.status(400).send({ err: "Both board and content and title is required" });

    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({ err: "Unauthorized" });
    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      if (err) return res.send(err)
      const createArticle = await Article.create({
        author: data.id,
        board,
        content,
        title,
      }).save();
      return res.status(201).send(createArticle);
    });

    // NOTE: Article.create({}) 와 Article({}).save() 의 기능은 같다!

    // const createArticle = await Article.create({
    //   // author: data.id,
    //   board,
    //   content,
    //   title,
    // });
    // return res.status(201).json(createArticle);
  } catch (error) {
    next(error)
  }
};

exports.readArticle = async (req, res) => {
  try {
    const article = await Article.find({});
    return res.send(article);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.detailArticle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send({ err: "articleId is invalid" });
    const article = await Article.findById(id);
    return res.send(article);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id, author, title, content } = req.body;
    if (!id || !author || !title || !content) return res.status(400).send({ err: "id, author, title, content is required" });
    const article = await Article.findByIdAndUpdate(
      { _id: id, author },
      { title, content },
      { new: true },
    );
    return res.send(article);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.hardDeleteArticle = async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both articleId and authorId is required" });

    const article = await Article.findByIdAndDelete({
      _id: id,
      author,
    });
    return res.send(article);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.softDleteArticle = async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both articleId and authorId is required" });

    const article = await Article.findByIdAndUpdate(
      {
        _id: id,
        author,
      },
      {
        deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      },
    )
    return res.send(article);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};