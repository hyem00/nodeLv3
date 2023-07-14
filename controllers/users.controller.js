const UserService = require("../services/users.service");

class UserController {
  userService = new UserService();

  signupUser = async (req, res) => {
    const { nickname, password, confirm } = req.body;

    try {
      const { status, message, user } = await this.userService.createUser(
        nickname,
        password,
        confirm
      );
      return res.status(status).json({ message, user });
    } catch (error) {
      return res
        .status(400)
        .json({ message: "계정생성에 실패하였습니다" + error.message });
    }
  };
  loginUser = async (req, res) => {
    const { nickname, password } = req.body;
    try {
      const { status, message, token } = await this.userService.loginUser(
        nickname,
        password
      );
      res.cookie("Authorization", `Bearer ${token}`, {
        expires: new Date(Date.now() + 3600000),
      }); // 1시간 동안 유효한 쿠키 설정
      return res.status(status).json({ message, token });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
}
module.exports = UserController;
