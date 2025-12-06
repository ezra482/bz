const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 关注的人
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 粉丝
}, { timestamps: true });

// 密码加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 验证密码
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 检查是否互关
userSchema.methods.isMutualFollow = async function (targetUserId) {
  const isFollowing = this.following.includes(targetUserId);
  const targetUser = await User.findById(targetUserId);
  const isFollowed = targetUser?.followers.includes(this._id);
  return isFollowing && isFollowed;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
