// 新增：导入消息路由
const messageRoutes = require('./routes/messageRoutes');

// 在用户路由后添加：
app.use('/api/messages', messageRoutes);
