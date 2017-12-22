const marked = require('marked');
const Post = require('../lib/mongo').Post;

const CommentModel = require('./comments')

// 给 post 添加留言数 commentsCount
Post.plugin('addCommentsCount', {
  afterFind: function (posts) {
    return Promise.all(posts.map(function (post) {
      return CommentModel.getCommentsCount(post._id).then(function (commentsCount) {
          post.commentsCount = commentsCount;
          return post;
        })
    }))
  },
  afterFindOne: function (post) {
    if (post) {
      return CommentModel.getCommentsCount(post._id).then (function (count) {
        post.commentsCount = count;
        return post;
      })
    }
    return post;
  }
})


// 将post的content内容从markdown 转换成 html
Post.plugin('contentToHtml', {
  afterFind: function (posts) {
    return posts.map(function (post) {
      post.content = marked(post.content);
      return post;
    })
  },
  afterFindOne: function (post){
    if (post) {
      post.content = marked(post.content);
    }
    return post;
  }
})


module.exports = {
  // 创建一篇文章
  create: function create(post) {
    return Post.create(post).exec();
  },

  // 通文章 id 获取一篇文章
  getPostById: function getPostById(post) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },

  // 按时间顺序获取所有用户文章或者某个特定用户的文章
  getPosts: function getPosts(author) {
    const query = {}
    if (author) {
      query.author = author;
    }

    return Post
          .find(query)
          .populate({path: 'author', model: 'User'})
          .sort({_id: -1})
          .addCreatedAt()
          .contentToHtml()
          .exec()
  },

  // 通过文章id 给pv 加1
  incPv: function incPv(postId) {
    return Post
        .update({_id: postId}, {$inc: { pv: 1}})
        .exec()
  },

  // 通过文章id 获取一篇原生文章(编辑前的文章)
  getRawPostById: function getRawPostById(postId) {
    return Post
      .findOne({_id: postId})
      .populate({path: 'author', model: 'User'})
      .exec()
  },

  // 更新一篇文章
  updatePostById: function updatePostById(postId, data) {
    return Post
      .update({_id: postId}, {$set: data})
      .exec()
  },

  // 通过文章id 删除一篇文章
  delPostById: function delPostById(postId, author) {
    return Post
      .remove({ author: author , _id: postId})
      .then(function (res) {
        // 文章删除后, 在删除该文章下的文章
        if (res.result.ok && res.result.n > 0) {
          return CommentModel.delCommentByPostId(postId)
        }
      })
      .exec()
  }
}






