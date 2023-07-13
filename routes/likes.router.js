const express = require("express");
const { Posts, Likes } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const { Op } = require("sequelize");

//좋아요 누르기 / 취소하기 API
// 로직 : 좋아요를 누르면 LIKES 테이블에 생성 이미 눌렀으면 같은 정보가 있으므로  삭제
// 전체에서 조회할때는  postid 로 검색해서 해당 칼럼 몇개 있는지로 확인 ?
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals;
  const { postId } = req.params;
  const findlike = await Likes.findOne({
    where: { [Op.and]: [{ UserId: userId }, { PostId: postId }] },
  });
  if (!findlike) {
    await Likes.create({ UserId: userId, PostId: postId });
    return res
      .status(200)
      .json({ message: "게시글의 좋아요를 등록하였습니다" });
  } else if (findlike) {
    await Likes.destroy({
      where: { [Op.and]: [{ UserId: userId }, { PostId: postId }] },
    });
    return res
      .status(200)
      .json({ message: "게시글의 좋아요를 취소하였습니다" });
  } else {
    return res
      .status(200)
      .json({ errorMessage: "게시글의 좋아요에 실패하였습니다" });
  }
});

//내가 좋아요 한 게시글 만 조회
router.get("/like", authMiddleware, async (req, res) => {
  const { userId } = res.locals;
  try {
    // 좋아요 한 글 찾기
    const findLikes = await Likes.findAll({ where: { UserId: userId } });

    // 좋아요 한 글의 PostId들 추출
    const postIds = findLikes.map((like) => like.PostId);

    // PostId들과 일치하는 글들 찾기
    const findPosts = await Posts.findAll({ where: { PostId: postIds } });

    // 찾은 글들 반환
    return res.json(findPosts);
  } catch (error) {
    return res
      .status(400)
      .json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다" });
  }
});

module.exports = router;
