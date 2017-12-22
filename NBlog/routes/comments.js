const express = require('express')
const router = express.Router()

const checkLogin = require('../middlewares/check').checkLogin
const CommentModel = require('../models/comments');

// POST /comments 创建一条留言
router.post('/', checkLogin, function (req, res, next) {
  const author = req.session.user._id;
  const postId = req.fields.postId;
  const content = req.fields.content;

  // 校验参数
  try{
    if (!content.lenght) {
      throw new Error('留言内容不能为空');
    }
  } catch (e) {
    req.flash('error', e.message)
    return res.redirect('back');
  }

  const comment = {
    author: author,
    postId: postId,
    content: content
  }
  // 创建留言, 并插入数据库
  CommentModel.create(comment)
    .then(function () {
      req.flash('success', '留言成功');
      res.redirect('back')
    })
    .catch(next);
})

// GET /comments/:commentId/remove 删除一条留言
router.get('/:commentId/remove', checkLogin, function (req, res, next) {
  const commentId = req.params.commentId;
  const author = req.session.user._id;

  CommentModel.delCommentById(comment)
    .then(function(comment) {
      if (!comment) {
        throw new Error('留言不存在');
      }
      if (comment.author.toString() !== author.toString()) {
        throw new Error('没有权限删除该文章');
      }
      CommentModel.delCommentById(commentId)
        .then(function() {
          req.flash('success', '删除留言成功');
          res.redirect('back');
        })
        .catch(next);
    })
})

module.exports = router
