const { Posts, Likes } = require("../models");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

class PostRepository {
  findAllPost = async () => {
    // ORM인 Sequelize에서 Posts 모델의 findAll 메소드를 사용해 데이터를 요청합니다.
    const posts = await Posts.findAll({
      order: [["createdAt", "desc"]],
      include: [
        {
          model: Likes,
          // sequelize 에서 조인문 사용하는 방법임 postId를 기준으로 left 조인했음
          attributes: [
            [sequelize.fn("COUNT", sequelize.col("Likes.likeId")), "likeCount"],
          ],
          // 이게 left 조인 설정하는거임
          required: false,
        },
      ],
      group: ["Posts.postId"],
    });

    return posts;
  };

  createPost = async (userId, title, content) => {
    // ORM인 Sequelize에서 Posts 모델의 create 메소드를 사용해 데이터를 요청합니다.
    const createPostData = await Posts.create({
      // 여기서 로컬의 유저랑 맞춰지는것
      UserId: userId,
      title,
      content,
    });

    return createPostData;
  };

  findDetailPost = async (postId) => {
    const posts = await Posts.findOne({ where: { postId } });
    return posts;
  };

  updatePost = async (postId, title, content) => {
    const post = await Posts.update(
      {
        title,
        content,
      },
      { where: { postId } }
    );
    return post;
  };

  deletePost = async (postId, userId) => {
    const post = await Posts.destroy({
      where: {
        [Op.and]: [{ postId }, { UserId: userId }],
      },
    });
    return post;
  };
}

module.exports = PostRepository;
