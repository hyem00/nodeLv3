const CommentsRepository = require("../repositories/comments.repository");

class CommentsService {
  commentsRepository = new CommentsRepository();

  findAllComment = async (postId) => {
    try {
      if (!postId) {
        return {
          status: 404,
          message: "댓글을 작성할 게시글이 존재하지 않습니다",
        };
      }
      const allComment = await this.commentsRepository.findAllComment(postId);
      return allComment.map((comment) => {
        return {
          PostId: comment.PostId,
          commentId: comment.commentId,
          comment: comment.comment,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        };
      });
    } catch (error) {
      console.log(error);
      return {
        status: 404,
        message: "댓글 조회에 실패하였습니다",
      };
    }
  };

  createComment = async (userId, comment, postId) => {
    try {
      if (!postId) {
        return {
          status: 404,
          message: "게시글이 존재하지 않습니다",
        };
      }
      if (!comment) {
        return {
          status: 412,
          message: "데이터 형식이 올바르지 않습니다",
        };
      }
      await this.commentsRepository.createComment(userId, comment, postId);
    } catch {
      return {
        status: 400,
        message: "댓글 작성에 실패하였습니다",
      };
    }
  };

  commentUpdate = async (postId, commentId, userId, comment) => {
    try {
      if (!comment) {
        return {
          status: 412,
          message: "데이터 형식이 올바르지 않습니다",
        };
      }
      const allComment = await this.commentsRepository.findAllComment(postId);
      const oneComment = await this.commentsRepository.findOneComment(
        commentId
      );
      if (!allComment) {
        return {
          status: 404,
          message: "게시글이 존재하지 않습니다",
        };
      }
      if (!oneComment) {
        return {
          status: 404,
          message: "댓글이 존재하지 않습니다",
        };
      }
      if (oneComment.dataValues.UserId !== userId) {
        return {
          status: 403,
          message: "댓글의 수정 권한이 존재하지 않습니다",
        };
      }
      await this.commentsRepository.commentUpdate(postId, commentId, comment);
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: "댓글 수정이 정상적으로 처리되지 않았습니다",
      };
    }
  };

  commentDelete = async (postId, commentId, userId) => {
    try {
      const allComment = await this.commentsRepository.findAllComment(postId);
      const oneComment = await this.commentsRepository.findOneComment(
        commentId
      );
      if (!allComment) {
        return {
          status: 404,
          message: "게시글이 존재하지 않습니다",
        };
      }
      if (!oneComment) {
        return {
          status: 404,
          message: "댓글이 존재하지 않습니다",
        };
      }
      if (oneComment.dataValues.UserId !== userId) {
        return {
          status: 403,
          message: "댓글의 삭제 권한이 존재하지 않습니다",
        };
      }
      await this.commentsRepository.commentDelete(postId, commentId);
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: "댓글 삭제가 정상적으로 처리되지 않았습니다",
      };
    }
  };
}
module.exports = CommentsService;
