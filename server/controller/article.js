const { Article } = require("../mongoose/schema");  // index.js - Article
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.createArticle = async (req, res, next) => {
  try {
    const { board, content, title } = req.body;
    // if (!board || !content || !title) return res.status(404).send({ err: "Both board and content and title is required" });
    // 25: createArticle  위에 작성하기. if (!createArticle) return res.status(404).send({ err: "Both board and content and title is required" });
    const { authorization } = req.headers;
    // if (!authorization) return res.status(401).send({ err: "Unauthorized" });
    // 위 내용은 유무 판단할 필요 없으므로 pass
    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      try {
        // if (err) return res.send(err)
        const createArticle = await Article.create({
          author: data.id,
          path: board,
          content,
          title,
        });
        return res.status(201).json(createArticle);
      } catch (error) {
        next(error)
      }
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

exports.readArticle = async (req, res, next) => {
  try {
    const article = await Article.find({});
    return res.status(200).json(article);
  } catch (error) {
    next(error)
    // return res.status(500).send({ err: err.message });
  }
};

exports.getArticleById = async (req, res, next) => {
  try {
    const { id } = req.params;  // 1.
    if (!mongoose.isValidObjectId(id)) return res.status(404).send({ err: "articleId is invalid" });  // 2
    const article = await Article.findById(id);  // 3
    if (!article) return res.status(404).send({ err: "articleId is invalid" });  // 4
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const { id, author, title, content } = req.body;
    const article = await Article.findByIdAndUpdate(
      { _id: id, author },
      { title, content },
      { new: true },
    );
    if (article) {
      return res.status(200).json(article);
    } else {
      return res.status(404).send();
    }
  } catch (err) {
    next(err)
  }
};

exports.hardDeleteArticle = async (req, res, next) => {
  try {
    const { id, author } = req.body;
    const article = await Article.findByIdAndDelete({
      _id: id,
      author,
    });
    if (article) {
      return res.status(200).json(article);
    } else {
      return res.status(404).send({ err: "Both articleId and authorId is required" });
    }
  } catch (err) {
    next(err)
    // console.log('err: ', err);
    // return res.status(500).send({ err: err.message });
  }
};

exports.softDeleteArticle = async (req, res, next) => {
  try {
    const { id, author } = req.body;
    const article = await Article.findByIdAndUpdate(
      {
        _id: id,
        author,
      },
      {
        deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      },
    )
    if (article) {
      return res.status(200).json(article);
    } else {
      return res.status(404).send({ err: "Both articleId and authorId is required" });
    }
  } catch (err) {
    next(err)
  }
};