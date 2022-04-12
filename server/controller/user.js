const { User } = require("../mongoose/schema");
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !password) return res.status(400).send({ err: "Require nickname and password" });
    // 만약 DB 에 email 이 존재하면 이미 생성된 유저 출력하기
    const user = await User.findOne({ email: email });
    if (user) return res.status(409).send({ err: "이미 존재하는 id 입니다." });

    const newUser = await User({ nickname, email, password })
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(401).send({ err: "email does not exist" });

    const correctUserEmail = user.authenticate(password);
    if (!correctUserEmail) return res.status(401).send({ err: "incorrect password" });

    // server/index.js 에서 설정한 secret 을 가져온다
    const secret = req.app.get("jwt-secret");
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        nickname: user.nickname,
      },
      secret,
      {
        expiresIn: "7d",
      },
    );
    // 로그인 시, 토큰을 같이 보내준다
    return res.send({
      msg: "로그인 성공",
      email: user.email,
      nickname: user.nickname,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};
exports.logoutUser = async (req, res) => {
  try {
    const { email } = req.body;
    // if (!email) return res.status(400).send({ err: "email is required" });
    const logout = await User.findOneAndDelete(email);
    return res.send(logout);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};
exports.tokenUser = async (req, res) => {
  try {
    const { authorization } = req.headers;
    // if (!authorization) return res.status(401).send({ err: "Unauthorized" });

    const token = authorization.split(" ")[1];
    const secret = req.app.get("jwt-secret");

    jwt.verify(token, secret, (err, data) => {
      if (err) return res.status(400).send({ err: err.message })
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};