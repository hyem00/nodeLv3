const PostRepository = require("../repositories/posts.repository");

class PostService {
  postRepository = new PostRepository();

  findAllPost = async () => {
    try {
      // 저장소(Repository)에게 데이터를 요청합니다.
      const allPost = await this.postRepository.findAllPost();
      // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
      return allPost.map((post) => {
        return {
          postId: post.postId,
          nickname: post.nickname,
          title: post.title,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      });
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: "게시글 조회에 실패했습니다",
      };
    }
  };

  createPost = async (userId, title, content) => {
    try {
      // 저장소(Repository)에게 데이터를 요청합니다.
      const createPostData = await this.postRepository.createPost(
        userId,
        title,
        content
      );

      // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
      return {
        postId: createPostData.null,
        title: createPostData.title,
        content: createPostData.content,
        createdAt: createPostData.createdAt,
        updatedAt: createPostData.updatedAt,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: "게시글 작성에 실패했습니다",
      };
    }
  };
  findDetailPost = async (postId) => {
    try {
      //저장소에게 데이터 요청
      const detailPost = await this.postRepository.findDetailPost(postId);
      if (!detailPost) {
        return {
          status: 400,
          message: "해당하는 게시글을 찾을 수 없습니다",
        };
      }
      return {
        postId: detailPost.null,
        title: detailPost.title,
        content: detailPost.content,
        createdAt: detailPost.createdAt,
        updatedAt: detailPost.updatedAt,
      };
    } catch (error) {
      return {
        status: 400,
        message: "게시글 조회에 실패했습니다",
      };
    }
  };
  updatePost = async (postId, userId, title, content) => {
    try {
      if (!title) {
        return {
          status: 400,
          message: "게시물 제목의 형식이 일치하지 않습니다",
        };
      }
      if (!content) {
        return {
          status: 400,
          message: "게시물 내용의 형식이 일치하지 않습니다",
        };
      }
      //저장소에게 데이터 요청
      const detailPost = await this.postRepository.findDetailPost(postId);
      if (!detailPost) {
        return {
          status: 404,
          message: "게시물을 찾을 수 없습니다",
        };
      }
      if (userId !== detailPost.UserId) {
        return {
          status: 400,
          message: "게시물을 수정할 권한이 없습니다",
        };
      }

      //저장소에게 데이터 요청
      const updatePost = await this.postRepository.updatePost(
        postId,
        title,
        content
      );
      return {
        postId: updatePost.null,
        title: updatePost.title,
        content: updatePost.content,
        createdAt: updatePost.createdAt,
        updatedAt: updatePost.updatedAt,
      };
    } catch (error) {
      return {
        status: 500,
        message: "게시글 수정에 실패했습니다",
      };
    }
  };

  deletePost = async (postId, userId) => {
    try {
      const post = await this.postRepository.findDetailPost(postId);
      if (post.UserId !== userId) {
        return {
          status: 403,
          message: "게시글 삭제 권한이 없습니다",
        };
      }
      await this.postRepository.deletePost(postId, userId);
      return {
        status: 201,
        message: "게시글 삭제에 성공했습니다",
      };
    } catch {
      return {
        status: 401,
        message: "게시글이 정상적으로 삭제되지 않았습니다",
      };
    }
  };
}

module.exports = PostService;
