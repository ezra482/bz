import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import VideoUpload from './pages/VideoUpload';
import VideoPage from './pages/VideoPage';
import Profile from './pages/Profile';

// 首页（视频列表，简化版）
const Home: React.FC = () => {
  return (
    <div className="container mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTubou 首页</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 示例视频卡片，实际需对接API获取列表 */}
        <div className="border rounded overflow-hidden hover:shadow-lg">
          <div className="bg-gray-300 h-48 flex items-center justify-center">
            <p>视频缩略图</p>
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-2">示例视频标题</h3>
            <p className="text-sm text-gray-600">上传者：testuser</p>
            <a href="/video/123" className="text-blue-500 mt-2 inline-block">
              播放视频
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<VideoUpload />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
