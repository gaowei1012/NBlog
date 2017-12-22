const User = require('../lib/mongo').User

module.exports = {
  //  注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  },

  getUserByName: function getUserByName(name) {
    return User
    // 通过用户名返回对应用户信息
      .findOne({name: name})
      .addCreatedAt()
      .exec()
  }
}
