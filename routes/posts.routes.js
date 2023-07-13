const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");

const PostsController = require("../controllers/posts.controller");
const postsController = new PostsController();

router.get("/", postsController.getPost);
router.post("/", authMiddleware, postsController.createPost);
router.get("/:postId", postsController.getDetailPost);
router.patch("/:postId", authMiddleware, postsController.updatePost);
router.delete("/:postId", authMiddleware, postsController.deletePost);

module.exports = router;
