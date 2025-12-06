import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ChatBox from '../components/ChatBox';

interface UserProfile {
  username: string;
  following: Array<{ _id: string; username: string }>;
  followers: Array<{ _id: string; username: string }>;
}

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  // 检查是否是当前用户的主页
  const isOwnProfile = user?._id === id;

  useEffect(() => {
    if (!id) return;
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getProfile(id);
        setProfile(res.data);
      } catch (err) {
        alert('用户不存在或加载失败');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, navigate]);

  // 关注/取消关注
  const handleFollow = async () => {
    try {
      if (profile?.following.some(item => item._id === user?._id)) {
        await userAPI.unfollow(id!);
      } else {
        await userAPI.follow(id!);
      }
      // 重新加载资料
      const res = await userAPI.getProfile(id!);
      setProfile(res.data);
    } catch (err) {
      alert('操作失败');
    }
  };

  if (loading) return <div className="container mx-auto mt-10 text-center">加载中...</div>;
  if (!profile) return null;

  return (
    <div className="container mx-auto mt-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">{profile.username} 的主页</h1>

      {/* 关注按钮（非自己主页显示） */}
      {!isOwnProfile && (
        <button
          onClick={handleFollow}
          className={`mb-6 p-2 rounded ${
            profile.following.some(item => item._id === user?._id)
              ? 'bg-gray-500 text-white'
              : 'bg-blue-500 text-white'
          }`}
        >
          {profile.following.some(item => item._id === user?._id)
            ? '取消关注'
            : '关注'}
        </button>
      )}

      {/* 互关后显示聊天按钮 */}
      {!isOwnProfile &&
        profile.following.some(item => item._id === user?._id) &&
        profile.followers.some(item => item._id === user?._id) && (
          <button
            onClick={() => setShowChat(!showChat)}
            className="mb-6 p-2 bg-green-500 text-white rounded"
          >
            {showChat ? '关闭聊天' : '打开聊天框'}
          </button>
        )}

      {/* 聊天框（仅互关显示） */}
      {showChat && (
        <div className="mb-10">
          <ChatBox targetUserId={id!} targetUsername={profile.username} />
        </div>
      )}

      {/* 关注/粉丝列表 */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">关注 ({profile.following.length})</h2>
          <div className="flex flex-wrap gap-3">
            {profile.following.length === 0 ? (
              <p className="text-gray-500">暂无关注</p>
            ) : (
              profile.following.map(item => (
                <div
                  key={item._id}
                  className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/profile/${item._id}`)}
                >
                  {item.username}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">粉丝 ({profile.followers.length})</h2>
          <div className="flex flex-wrap gap-3">
            {profile.followers.length === 0 ? (
              <p className="text-gray-500">暂无粉丝</p>
            ) : (
              profile.followers.map(item => (
                <div
                  key={item._id}
                  className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/profile/${item._id}`)}
                >
                  {item.username}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
