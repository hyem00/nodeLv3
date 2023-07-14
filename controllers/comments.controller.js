const CommentService = require("../services/comments.service");

class CommentsController {
  commentService = new CommentService();

  getComment = async (req, res, next) => {
    const { postId } = req.params;
    const { status, message, comments } =
      await this.commentService.findAllComment(postId);
    res.status(status).json({ message, comments });
  };

  createComment = async (req, res, next) => {
    const { userId } = res.locals;
    const { comment } = req.body;
    const { postId } = req.params;

    const { status, message } = await this.commentService.createComment(
      userId,
      comment,
      postId
    );
    res.status(status).json({ message });
  };

  updateComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;
    const { comment } = req.body;
    const { status, message } = await this.commentService.commentUpdate(
      postId,
      commentId,
      userId,
      comment
    );
    res.status(status).json({ message });
  };

  deleteComment = async (req, res, next) => {
    const { postId, commentId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.commentService.commentDelete(
      postId,
      commentId,
      userId
    );
    res.status(status).json({ message });
  };
}
module.exports = CommentsController;
