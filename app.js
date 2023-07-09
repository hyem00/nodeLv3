const express = require("express");
const postsRouter = require("./routes/posts.route");
const usersRouter = require("./routes/users.route");
const commentRouter = require("./routes/comment.router");
const likeRouter = require("./routes/like.router");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use("/api", [postsRouter, usersRouter, commentRouter, likeRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
