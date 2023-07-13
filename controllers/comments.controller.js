const CommentService = require("../services/comments.service");

class CommentsController {
  commentService = new CommentService();

  getComment = async (req, res, next) => {
    const { postId } = req.params;
    const comments = await this.commentService.findAllComment(postId);
    res.status(200).json({ data: comments });
  };

  createComment = async (req, res, next) => {
    const { userId } = res.locals;
    const { comment } = req.body;
    const { postId } = req.params;

    const comments = await this.commentService.createComment(
      userId,
      comment,
      postId
    );
    res.status(200).json({ message: "댓글이 생성되었습니다" });
  };

  updateComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;
    const { comment } = req.body;
    await this.commentService.commentUpdate(postId, commentId, userId, comment);
    res.status(200).json({ message: "댓글 수정이 되었습니다" });
  };

  deleteComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;
    await this.commentService.commentDelete(postId, commentId, userId);
    res.status(200).json({ message: "댓글이 삭제되었습니다" });
  };
}
module.exports = CommentsController;
