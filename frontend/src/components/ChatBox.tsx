import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface Message {
  _id: string;
  sender: { _id: string; username: string };
  receiver: string;
  content: string;
  createdAt: string;
}

interface ChatBoxProps {
  targetUserId: string;
  targetUsername: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ targetUserId, targetUsername }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { user, token } = useAuth();
  const socketRef = useRef<SocketIOClient.Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 连接Socket.io
  useEffect(() => {
    if (!token || !user) return;

    socketRef.current = io('http://localhost:5000', {
      auth: { token }
    });

    socketRef.current.on('connect', () => console.log('聊天连接成功'));
    socketRef.current.on('newMessage', (msg) => setMessages(prev => [...prev, msg]));
    socketRef.current.on('error', (err) => alert(err));

    // 加载历史消息
    fetch(`http://localhost:5000/api/messages/${targetUserId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data));

    return () => socketRef.current?.disconnect();
  }, [token, user, targetUserId]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socketRef.current) return;

    socketRef.current.emit('sendMessage', {
      receiverId: targetUserId,
      content: input
    });

    setInput('');
  };

  return (
    <div className="w-full max-w-md border rounded-lg h-[500px] flex flex-col">
      <div className="p-2 bg-gray-100 border-b font-bold">
        与 {targetUsername} 聊天（仅互关可见）
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map(msg => (
          <div
            key={msg._id}
            className={`mb-2 p-2 rounded-lg max-w-[80%] ${
              msg.sender._id === user?._id ? 'ml-auto bg-blue-100' : 'bg-gray-200'
            }`}
          >
            <p className="text-sm text-gray-500">{msg.sender.username}</p>
            <p>{msg.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-2 border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          发送
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
