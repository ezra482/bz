const express = require('express');
const router = express.Router();
const { uploadVideo, streamVideo } = require('../controllers/videoController');
const Video = require('../models/Video');

// 上传视频
router.post('/upload', uploadVideo);
// 流式播放
router.get('/stream/:id', streamVideo);
// 获取单个视频详情
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploader', 'username _id')
      .lean();
    if (!video) return res.status(404).json({ message: '视频不存在' });
    // 增加播放量
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: '获取视频失败', error: err.message });
  }
});
// 获取视频列表
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find()
      .populate('uploader', 'username _id')
      .sort({ createdAt: -1 })
      .lean();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: '获取视频列表失败', error: err.message });
  }
});

module.exports = router;
