import React, { useState } from 'react';
import { videoAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const VideoUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert('请选择视频文件');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('video', videoFile);

    try {
      // 上传视频（带进度监听）
      await videoAPI.upload(formData);
      alert('视频上传成功！');
      navigate('/');
    } catch (err: any) {
      alert(err.response?.data?.message || '视频上传失败');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">上传视频</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">视频标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-1">视频描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded"
            disabled={loading}
          ></textarea>
        </div>
        <div>
          <label className="block mb-1">选择视频文件</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="w-full p-2 border rounded"
            disabled={loading}
          />
          {videoFile && <p className="mt-2 text-sm text-gray-600">已选择：{videoFile.name}</p>}
        </div>

        {loading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <button
          type="submit"
          className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          disabled={loading}
        >
          {loading ? '上传中...' : '上传视频'}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
