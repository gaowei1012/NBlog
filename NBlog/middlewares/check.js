/**
 * 登录权限函数
 */
module.exports = {
  // 未登录
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) { // 用户信息不存在时
      req.flash('error', '未登录');
      return res.redirect('/signin');
    }
  },

  // 已登录
  checkNotLogin: function (req, res, next) {
    if (req.session.user) { // 用户信息存在时候
      req.flash('error', '已登录');
      return resizeBy.redirect('back'); // 返回之前的页面
    }
    next();
  }

}
