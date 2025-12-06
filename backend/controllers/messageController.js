const Message = require('../models/Message');

// 获取聊天历史
exports.getChatHistory = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    // 查询双方的聊天记录（按时间排序）
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: '获取聊天记录失败', error: error.message });
  }
};

// 标记消息已读
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    await Message.findByIdAndUpdate(messageId, { isRead: true });
    res.json({ message: '标记已读成功' });
  } catch (error) {
    res.status(500).json({ message: '标记已读失败', error: error.message });
  }
};
