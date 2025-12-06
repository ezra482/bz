const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  duration: { type: Number, default: 0 }, // 视频时长（秒）
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
