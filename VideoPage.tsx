import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { videoAPI } from '../services/api';

interface Video {
  _id: string;
  title: string;
  description: string;
  uploader: {
    _id: string;
    username: string;
  };
  views: number;
  createdAt: string;
}

const VideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchVideo = async () => {
      try {
        const res = await videoAPI.getVideo(id);
        setVideo(res.data);
      } catch (err) {
        alert('视频不存在或加载失败');
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [id]);

  if (loading) return <div className="container mx-auto mt-10 text-center">加载中...</div>;
  if (!video) return <div className="container mx-auto mt-10 text-center">视频不存在</div>;

  return (
    <div className="container mx-auto mt-10 px-4">
      <VideoPlayer videoId={video._id} title={video.title} />
      <div className="mt-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{video.title}</h2>
          <p className="text-gray-600">播放量：{video.views}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="font-semibold">{video.uploader.username}</span>
          <span className="text-gray-500 text-sm">
            发布于 {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">描述</h3>
          <p>{video.description || '暂无描述'}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
