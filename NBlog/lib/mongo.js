const config = require('config-lite')(__dirname);
const Mongolass = require('mongolass');
const mongolass = new Mongolass();
mongolass.connect(config.mongodb);

// 定义User模型schema
exports.User = mongolass.model('User', {
  name: { type : 'string' },
  password: { type : 'string' },
  avatar: { type : 'string' },
  gender: { type : 'string' },
  bio: { type : 'string' }
});

exports.User.index({name: 1}, { unique: true}).exec(); // 根据用户名找到用户, 用户名全局唯一


const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
  // 根据 id 创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (result) {
    result.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(result._id)).format('YYY-MM-DD HH:mm');
    })
    return result;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYY-MM-DD HH:mm')
    }
    return result;
  }
})


// 文章模型
exports.Post = mongolass.model('Post', {
  author: { type: 'string'},
  title: { type: 'string'},
  content: { type: 'string'},
  pv : { type: 'number'}
});

exports.Post.index({author: 1, _id: -1}).exec(); // 按创建时间顺序查看用户信息

// 留言模板
exports.Comment = mongolass.model('Comment', {
  author: { type: 'string'},
  content: { type: 'string'},
  postId: { type: 'string'}
})

exports.Comment.index({ postId: 1, _id: 1}).exec(); // 通过该篇文章的id 获取所有留言, 按创建时间升序排列
