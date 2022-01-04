const express = require('express');
const router = express.Router();
const model = require('../mongoose/model');
const jwt = require("jsonwebtoken");

// signup
router.post("/user/signup", async (req, res) => {
  const { nickname, email, password } = req.body;
  // 만약 DB 에 email 이 존재하면 이미 생성된 유저 출력하기
  const duplicationUser = await model.User.findOne({ email: email });
  if (duplicationUser) return res.send("이미 생성된 유저");

  const newUser = await model.User({ nickname, email, password }).save();
  !newUser ? res.send("회원가입 실패") : res.send(newUser);
});

// login - user 인증하기 위한 email, password 검사
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  const userEmail = await model.User.findOne({ email: email });
  const correctUserEmail = userEmail.authenticate(password);

  if (!userEmail._id) {
    return res.send({ error: true, msg: "존재하지 않는 이메일" });
  }

  if (!correctUserEmail) {
    return res.send({ error: true, msg: "잘못된 패스워드" });
  }

  // server/index.js 에서 설정한 secret 을 가져온다
  const secret = req.app.get("jwt-secret");
  const token = jwt.sign(
    {
      id: userEmail._id,
      email: userEmail.email,
      nickname: userEmail.nickname,
    },
    secret,
    {
      expiresIn: "7d",
    },
  );

  // 로그인 시, 토큰을 같이 보내준다
  res.send({
    error: false,
    msg: "로그인 성공",
    email: correctUserEmail.email,
    nickname: correctUserEmail.nickname,
    token: token,
  });
});

// 사용자 토큰 체크
router.get("/user/token", async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) return res.send(false);

  const token = authorization.split(" ")[1];
  const secret = req.app.get("jwt-secret");

  jwt.verify(token, secret, (err, data) => {
    err ? res.send(err) : res.send(data);
  });
});

module.exports = router;