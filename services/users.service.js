const UserRepository = require("../repositories/users.repository");
const jwt = require("jsonwebtoken");
const idcheck = /^(?=.*[\da-zA-Z])[0-9a-zA-Z]{3,}$/;

class UserService {
  userRepository = new UserRepository();

  createUser = async (nickname, password, confirm) => {
    try {
      const target = await this.userRepository.findUser(nickname);
      if (target) {
        throw new Error("중복된 닉네임이 존재합니다.");
      } else if (!idcheck.test(nickname)) {
        throw new Error(
          "닉네임은 최소 3자 이상, 알파벳 대소문자(a~z, A~Z), 숫자(0~9)로 구성해 주세요."
        );
      } else if (password.length < 4 || password.includes(nickname)) {
        throw new Error(
          "비밀번호는 최소 4자 이상, 닉네임과 같은 값이 포함될 수 없습니다."
        );
      } else if (password !== confirm) {
        throw new Error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      } else if (password === confirm) {
        await this.userRepository.createUser(nickname, password);
      }
    } catch (error) {
      console.log(error);
      return {
        status: 400,
        message: "회원가입에 실패하였습니다",
      };
    }
  };
  loginUser = async (nickname, password) => {
    const target = await this.userRepository.findUser(nickname);

    if (!target || target.password !== password) {
      throw new Error("닉네임 또는 패스워드를 확인해주세요.");
    } else if (target.password === password) {
      const token = this.generateToken(target.userId);
      return token;
    }
  };
  generateToken = (userId) => {
    const payload = { userId };
    const secretKey = "customized_secret_key";
    const expiresIn = "1h";

    return jwt.sign(payload, secretKey, { expiresIn });
  };
}

module.exports = UserService;
