const express = require('express');
const router = express.Router();
const { getChatHistory, markAsRead } = require('../controllers/messageController');

// 获取聊天历史
router.get('/:receiverId', getChatHistory);
// 标记消息已读
router.patch('/:messageId/read', markAsRead);

module.exports = router;
