const express = require("express");
const router = express.Router();

const postsRouter = require("./posts.routes");
router.use("/posts/", postsRouter);

const usersRouter = require("./users.routes");
router.use("/users/", usersRouter);

const commentRouter = require("./comments.routes");
router.use("/comments/", commentRouter);

//좋아요 기능은 라우터 분리 안했음

module.exports = router;
