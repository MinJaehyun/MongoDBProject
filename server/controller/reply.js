const { Reply } = require("../mongoose/schema")
const jwt = require("jsonwebtoken");

exports.createReply = async (req, res) => {
  try {
    const { commentId, content } = req.body;
    if (!commentId || !content) return res.status(400).send({ err: "commentId and content is required" });
    const { authorization } = req.headers;
    if (!authorization) return res.status(401).send({ err: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, async (err, data) => {
      if (err) return res.send(err);
      const reply = await Reply({ author: data.id, commentId, content }).save();
      return res.status(201).send(reply);
    });
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }

};
exports.readReply = async (req, res) => {
  try {
    const reply = await Reply.find({});
    return res.send(reply);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.updateReply = async (req, res) => {
  try {
    const { replyId, authorId, content } = req.body;
    if (!replyId || !authorId || !content) return res.status(500).send({ err: "replyId and authorId and content is required" })
    const reply = await Reply.findOneAndUpdate(
      {
        _id: replyId,
        authorId,
      },
      {
        content
      },
      {
        new: true,
      }
    )
    return res.send(reply);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.deleteHardReply = async (req, res) => {
  try {
    const { replyId, authorId } = req.body;
    if (!replyId || !authorId) return res.status(400).send({ err: "replyId and authorId is required" });
    const reply = await Reply.deleteOne({ _id: replyId, authorId });
    return res.send(reply);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};

exports.deleteSoftReply = async (req, res) => {
  try {
    const { replyId, authorId } = req.body;
    if (!replyId || !authorId) return res.status(400).send({ err: "replyId and authorId is required" });
    const reply = await Reply.findOneAndUpdate(
      {
        _id: replyId,
        authorId,
      },
      {
        deleteTime: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      },
    )
    return res.send(reply);
  } catch (err) {
    console.log('err: ', err);
    return res.status(500).send({ err: err.message });
  }
};