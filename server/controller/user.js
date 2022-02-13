const { User } = require("../mongoose/schema");
const jwt = require("jsonwebtoken");

exports.signupUser = async (req, res) => {
  try {
    const { nickname, email, password } = req.body;
    if (!nickname || !password) return res.status(400).send({ err: "Both nickname and password is required" });
    // 만약 DB 에 email 이 존재하면 이미 생성된 유저 출력하기
    const duplicationUser = await User.findOne({ email: email });
    if (duplicationUser) return res.status(400).send({ err: "user does not exist" });

    const newUser = await User({ nickname, email, password })
    await newUser.save();
    return res.status(201).send(`Membership registration completed`);
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userEmail = await User.findOne({ email: email });
    if (!userEmail) return res.status(400).send({ err: "email does not exitst" });

    const correctUserEmail = userEmail.authenticate(password);
    if (!correctUserEmail) return res.status(400).send({ err: "incorrect password" });

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
    return res.send({
      msg: "로그인 성공",
      email: userEmail.email,
      nickname: userEmail.nickname,
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
    console.log('email: ', email);
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