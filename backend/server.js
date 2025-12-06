const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const videoRoutes = require('./routes/videoRoutes');
const userRoutes = require('./routes/userRoutes');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

dotenv.config();
const app = express();
const server = http.createServer(app);

// 中间件
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: './tmp' }));
app.use('/videos', express.static(process.env.VIDEO_UPLOAD_DIR));

// 数据库连接
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => console.log('MongoDB连接失败:', err));

// JWT验证中间件
app.use('/api', (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: '未授权' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'token无效' });
  }
});

// 路由
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// Socket.io 实时聊天（仅互关用户可聊天）
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN, credentials: true }
});

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('未授权'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error('token无效'));
  }
});

io.on('connection', async (socket) => {
  console.log(`用户 ${socket.user._id} 连接`);

  // 加入个人房间（用于私聊）
  socket.join(socket.user._id);

  // 发送消息
  socket.on('sendMessage', async (data) => {
    const { receiverId, content } = data;
    const sender = await User.findById(socket.user._id);
    
    // 验证是否互关
    const isMutual = await sender.isMutualFollow(receiverId);
    if (!isMutual) return socket.emit('error', '仅互关用户可聊天');

    // 保存消息
    const message = await Message.create({
      sender: socket.user._id,
      receiver: receiverId,
      content
    });

    // 发送给接收者
    io.to(receiverId).emit('newMessage', message);
    socket.emit('messageSent', message);
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log(`用户 ${socket.user._id} 断开连接`);
  });
});

// 启动服务
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));
