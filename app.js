const express = require("express");
const cookieParser = require("cookie-parser");
const likeRouter = require("./routes/likes.router");

const app = express();
const PORT = 3000;
const router = require("./routes");

app.use(express.json());
app.use(cookieParser());
app.use("/api", router, [likeRouter]);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
