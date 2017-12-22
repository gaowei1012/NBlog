const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin

// GET /signout 登出
router.get('/', checkLogin, function (req, res, next) {
  req.session.user = null; // 清空session 中的用户信息
  req.flash('success', '登出成功');
  // 跳转到主页
  res.render('/posts');
});

module.exports = router
