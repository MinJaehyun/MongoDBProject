const { Comment } = require("../mongoose/schema");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

exports.createComment = async (req, res) => {
  try {
    const { articleId, content } = req.body;
    if (!articleId || !content) return res.status(400).send({ err: "Both articleId and content is required" });

    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({ msg: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      if (err) return res.send(err);
      const comment = await Comment({ author: data.id, articleId, content }).save();
      return res.status(201).send(comment);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { commentId, author, content } = req.body;
    if (!commentId || !author || !content) return res.status(400).send({ err: "commentId and author and content is required" });

    const comment = await Comment.findOneAndUpdate(
      {
        _id: commentId,
        author,
      },
      {
        content
      },
      {
        new: true,
      },
    )
    return res.send(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.detailComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).send({ err: "commentDetailId is invalid" });
    const commentDetail = await Comment.findById(id);
    return res.send(commentDetail);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.readComment = async (req, res) => {
  try {
    const allComment = await Comment.find({});
    return res.send(allComment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.deleteHardComment = async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both commentId and authorId is required" });
    const comment = await Comment.deleteOne(
      {
        _id: id,
        author,
      }
    );
    return res.send(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};

exports.deleteSoftComment = async (req, res) => {
  try {
    const { id, author } = req.body;
    if (!id || !author) return res.status(400).send({ err: "Both commentId and authorId is required" });
    const comment = await Comment.findOneAndUpdate(
      {
        _id: id,
        author,
      },
      {
        deleteTime: new Date().getTime() + 1 // 30 * 24 * 60 * 60 * 1000,
      },
    )
    return res.send(comment);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};
