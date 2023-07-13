const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");
const cookieParser = require("cookie-parser");
const UserController = require("../controllers/users.controller");
const userController = new UserController();

router.use(cookieParser());
router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

module.exports = router;
