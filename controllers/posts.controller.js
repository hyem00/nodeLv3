const PostService = require("../services/posts.service");

// Post의 컨트롤러(Controller)역할을 하는 클래스
class PostsController {
  postService = new PostService(); // Post 서비스를 클래스를 컨트롤러 클래스의 멤버 변수로 할당합니다.

  getPost = async (req, res, next) => {
    // 서비스 계층에 구현된 findAllPost 로직을 실행합니다.
    const { status, message, posts } = await this.postService.findAllPost();
    res.status(status).json({ message, posts });
  };

  createPost = async (req, res, next) => {
    const { title, content } = req.body;
    const { userId } = res.locals;
    // 서비스 계층에 구현된 createPost 로직을 실행합니다.
    const { status, message } = await this.postService.createPost(
      userId,
      title,
      content
    );

    res.status(status).json({ message });
  };

  getDetailPost = async (req, res, next) => {
    const { postId } = req.params;

    const { status, message, posts } = await this.postService.findDetailPost(
      postId
    );
    res.status(status).json({ message, posts });
  };

  updatePost = async (req, res, next) => {
    const { postId } = req.params;
    const { title, content } = req.body;
    const { userId } = res.locals;
    const { status, message } = await this.postService.updatePost(
      postId,
      userId,
      title,
      content
    );
    res.status(status).json({ message });
  };

  deletePost = async (req, res, next) => {
    const { postId } = req.params;
    const { userId } = res.locals;
    const { status, message } = await this.postService.deletePost(
      postId,
      userId
    );
    res.status(status).json({ message });
  };
}

module.exports = PostsController;
