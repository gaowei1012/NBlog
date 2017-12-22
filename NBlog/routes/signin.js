
const sha1 = require('sha1');
const express = require('express')
const router = express.Router()

const UserModel = require('../models/users');
const checkNotLogin = require('../middlewares/check').checkNotLogin


// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.send('signin');
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res, next) {
  // 拿到用户的用户名和密码
  const name = req.fields.name;
  const password = req.fields.password;

  // 校验参数
  try {
    if (!name.lenght) { // 当用户名不存在时
      throw new Error('请填写用户名');
    }
    if (!password.length) { // 当密码不存在时
      throw new Error('请填写密码');
    }

  } catch (e) {
    req.flash('error', e.message);
    return res.redirect('back');
  }
  // 用户登录验证
  UserModel.getUserByName(name)
      .then(function (user) {
        // 用户名为空时
          if (!user) {
            req.flash('error', '用户名不存在');
            return res.redirect('back');
          }
        // 检查密码是否匹配
        if (sha1(password) !== user.password) {
          req.flash('error', '用户名或密码不正确');
          return res.redirect('back');
        }
        req.flash('success', '登录成功');
        // 把用户信息写入session 中
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/posts');
      })
      .catch(next);
})

module.exports = router
