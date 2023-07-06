const express = require("express");
const { Comments, Posts } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const { Op, Transaction } = require("sequelize");

//댓글 목록 조회
router.get("/posts/:postId/comments", async (req, res) => {
  const { postId } = req.params;
  if (!postId) {
    res
      .status(404)
      .json({ errorMessage: "댓글을 작성할 게시글이 존재하지 않습니다" });
  }
  try {
    const comment = await Comments.findAll({
      attributes: [
        "commentId",
        "UserId",
        // "nickname",
        "comment",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ comments: comment });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ errorMessage: "댓글 조회에 실패하였습니다" });
  }
});

//댓글 작성 api
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const { userId } = res.locals;
  const { comment } = req.body;
  const { postId } = req.params;

  if (!comment) {
    return res
      .status(412)
      .json({ errorMessage: "데이터 형식이 올바르지 않습니다" });
  }

  try {
    if (!postId) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다" });
    }
    if (comment) {
      await Comments.create({
        UserId: userId,
        PostId: postId,
        comment,
      });
      return res.status(202).json({ message: "댓글을 작성하였습니다." });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errorMessage: "댓글 작성에 실패하였습니다" });
  }
});

//댓글 수정
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;
    const { comment } = req.body;

    const findpost = await Posts.findOne({ where: { postId } });
    const findcomment = await Comments.findOne({ where: { commentId } });
    //promise 안에 패딩되어있는 값 콘솔로그 찍는법 where 뒤에 .then(console.log); 해주면 됌

    if (!findpost)
      return res
        .status(404)
        .json({ errorMessage: "게시물이 존재하지 않습니다" });
    //  콘솔로그 찍어보면  dataValues 여기 값 안에 들어가 있어서 한번 걸러줘야함
    if (findcomment.dataValues.UserId !== userId)
      return res
        .status(403)
        .json({ errorMessage: "댓글의 수정 권한이 존재하지 않습니다" });

    if (!comment)
      return res
        .status(412)
        .json({ errorMessage: "데이터 형식이 올바르지 않습니다" });

    if (!findcomment)
      return res.status(404).json({ errorMessage: "댓글이 존재하지 않습니다" });

    try {
      await Comments.update(
        { comment },
        { where: { [Op.and]: [{ PostId: postId }, { commentId }] } }
      );
      return res.status(200).json({ message: "댓글을 수정하였습니다" });
    } catch {
      res
        .status(400)
        .json({ errorMessage: "댓글 수정이 정상적으로 처리되지 않았습니다" });
    }

    return res
      .status(400)
      .json({ errorMessage: "댓글 수정이 정상적으로 처리되지 않았습니다" });
  }
);

// 게시글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;

    const findpost = await Posts.findOne({ where: { postId } });
    const findcomment = await Comments.findOne({ where: { commentId } });

    if (!findpost) {
      return res.status(404).json({
        message: "게시글이 존재하지 않습니다",
      });
    }

    if (findcomment.dataValues.UserId !== userId)
      return res
        .status(403)
        .json({ errorMessage: "댓글의 삭제 권한이 존재하지 않습니다" });

    if (!commentId) {
      return res.status(404).json({
        message: "댓글이 존재하지 않습니다.",
      });
    }
    try {
      await Comments.destroy({
        where: {
          [Op.and]: [{ userId }, { commentId }],
        },
      });
      res.status(200).json({ message: "댓글을 삭제하였습니다" });
    } catch {
      return res
        .status(403)
        .json({ errorMessage: "댓글 삭제가 정상적으로 처리되지 않았습니다" });
    }
    // return res.status(400).json({ errorMessage: "댓글 삭제에 실패하였습니다" });
  }
);

module.exports = router;
