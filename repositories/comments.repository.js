const { Comments } = require("../models");
const { Op } = require("sequelize");

class CommentsRepository {
  findAllComment = async (postId) => {
    // console.log(postId); 잘 들어옴
    const comments = await Comments.findAll({ where: { PostId: postId } });
    return comments;
  };
  createComment = async (userId, comment, postId) => {
    await Comments.create({ UserId: userId, PostId: postId, comment });
  };
  findOneComment = async (commentId) => {
    const comments = await Comments.findOne({ where: { commentId } });
    return comments;
  };
  commentUpdate = async (postId, commentId, comment) => {
    await Comments.update(
      { comment },
      { where: { [Op.and]: [{ PostId: postId }, { commentId }] } }
    );
  };
  commentDelete = async (postId, commentId) => {
    await Comments.destroy({
      where: {
        [Op.and]: [{ PostId: postId }, { commentId }],
      },
    });
  };
}
module.exports = CommentsRepository;
