const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// 上传视频（转码为高清MP4）
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: '请上传视频文件' });
    
    const { title, description } = req.body;
    const uploadDir = process.env.VIDEO_UPLOAD_DIR;
    const originalPath = req.file.path;
    const videoId = Date.now().toString();
    const outputPath = path.join(uploadDir, `${videoId}.mp4`);

    // 用ffmpeg转码为高清（1080p）MP4
    await execAsync(`ffmpeg -i ${originalPath} -vf scale=1920:1080 -c:v libx264 -crf 23 -c:a aac ${outputPath}`);
    fs.unlinkSync(originalPath); // 删除原文件

    // 创建缩略图
    const thumbnailPath = path.join(uploadDir, `${videoId}.jpg`);
    await execAsync(`ffmpeg -i ${outputPath} -ss 00:00:01 -vframes 1 ${thumbnailPath}`);

    const video = await Video.create({
      title,
      description,
      videoUrl: `/videos/${videoId}.mp4`,
      thumbnail: `/videos/${videoId}.jpg`,
      uploader: req.user._id,
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ message: '视频上传失败', error: error.message });
  }
};

// 高清视频流式播放（支持Range请求）
exports.streamVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const videoPath = path.join(process.env.VIDEO_UPLOAD_DIR, `${videoId}.mp4`);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    res.status(404).json({ message: '视频不存在' });
  }
};
