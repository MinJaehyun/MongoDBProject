const Router = require('express');
const router = Router();
const userController = require("../controller/user");

// signup 
router.post("/user/signup", userController.signupUser);

// login   
router.post("/user/login", userController.loginUser);

// logout 
router.post("/user/logout", userController.logoutUser);

// 사용자 토큰 체크 
router.get("/user/token", userController.tokenUser);

module.exports = router;