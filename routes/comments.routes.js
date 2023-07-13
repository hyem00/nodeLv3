const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");

const CommentsController = require("../controllers/comments.controller");
const commentsController = new CommentsController();

router.get("/posts/:postId", commentsController.getComment);
router.post("/posts/:postId", authMiddleware, commentsController.createComment);
router.patch(
  "/posts/:postId/:commentId",
  authMiddleware,
  commentsController.updateComment
);
router.delete(
  "/posts/:postId/:commentId",
  authMiddleware,
  commentsController.deleteComment
);

module.exports = router;
