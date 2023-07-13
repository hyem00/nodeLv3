const { Users } = require("../models");

class UserRepository {
  findUser = async (nickname) => {
    const user = await Users.findOne({ where: { nickname } });
    return user;
  };
  createUser = async (nickname, password) => {
    const createUser = await Users.create({
      // 여기서 로컬의 유저랑 맞춰지는것
      nickname: nickname,
      password: password,
    });

    return createUser;
  };
}

module.exports = UserRepository;
