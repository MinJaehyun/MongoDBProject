const express = require('express');
const router = express.Router();
const model = require('../mongoose/model');

// signup
router.post("/user/signup", async (req, res) => {
  const { nickname, email, password } = req.body;
  try {
    const newUser = await model.User({
      nickname, email, password
    }).save();
    res.send(newUser._id ? true : false);
  }
  catch {
    res.send("이미 생성된 유저")
  }
});

// login - user 인증하기 위한 email, password 검사
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const userEmail = await model.User.find({ email: email });
  if (!userEmail._id) {
    return res.send({ error: true, msg: "존재하지 않는 이메일" });
  }

  const correctUserEmail = userEmail.authenticate(password);
  if (!correctUserEmail) {
    return res.send({ error: true, msg: "잘못된 패스워드" });
  }

  res.send({ email: correctUserEmail.email, nickname: correctUserEmail.nickname });
});

module.exports = router;