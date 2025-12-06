# YouTubou - 类似YouTube的视频网站
基于 React + Node.js + MongoDB 构建的视频平台，支持高清视频播放、用户互关、实时聊天。

## 功能特性
✅ 高清视频上传/转码/流式播放（支持1080p）
✅ 用户注册/登录（JWT认证）
✅ 关注/取消关注、互关验证
✅ 实时聊天（仅互关用户可聊）
✅ 个人主页（关注/粉丝列表）
✅ 视频播放量统计

## 环境准备
1. 安装 Node.js (v16+)：https://nodejs.org/
2. 安装 MongoDB：本地版 / MongoDB Atlas（云端免费）
3. 安装 FFmpeg：
   - Windows：下载后添加到环境变量
   - Mac：`brew install ffmpeg`
   - Linux：`sudo apt install ffmpeg`

## 本地部署步骤
### 1. 克隆仓库
```bash
git clone https://github.com/你的用户名/youtubou.git
cd youtubou
