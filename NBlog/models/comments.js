const marked = require('marked');
const Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
  afterFind: function (comments) {
    return comments.map(function(comment) {
      comment.content = marked(comment.content);
      return comment;
    })
  }
})

module.exports = {
  //  创建一个留言
  create: function create(comment) {
    return Comment.create(comment).exec();
  },

  // 通过留言id 获取一条留言
  getCommentById: function getCommentById(comment) {
    return Comment.findOne({ _id: commentId }).exec();
  },

  // 通过留言id 删除一条留言
  delCommentById: function delCommentById(commentId) {
    return Comment.remove({ _id: commentId }).exec();
  },

  // 通过文章id 删除所有留言
  delCommentByPostId: function delCommentByPostId(postId) {
    return Comment.remove({ postId: postId }).exec();
  },

  // 通过文章id 获取该文章下所有留言, 按留言时间升序
  getComments: function getComments(postId) {
    return Post
      .find({ postId: postId })
      .populate({ path: 'author', model: 'User'})
      .sort({ _id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 通过文章id 获取该文章下所有留言
  getCommentsCount: function getCommentsCount(postId) {
    return Comment.count({ postId: postId}).exec();
  }

}
