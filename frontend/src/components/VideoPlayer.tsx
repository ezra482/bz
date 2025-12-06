import React, { useRef, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto"
          controls
          poster={`http://localhost:5000/videos/${videoId}.jpg`}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source 
            src={`http://localhost:5000/api/videos/stream/${videoId}`} 
            type="video/mp4" 
          />
          您的浏览器不支持HTML5视频播放
        </video>
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <button className="bg-red-600 text-white p-4 rounded-full">播放</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
