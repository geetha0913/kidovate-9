import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Heart,
  ThumbsUp,
  Star as StarIcon,
  Smile,
  Send,
  X
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import { communityAPI } from '../utils/api';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPost, setNewPost] = useState({
    postType: 'story',
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await communityAPI.getPosts();
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) return;
    
    try {
      await communityAPI.createPost(newPost);
      setShowCreateModal(false);
      setNewPost({ postType: 'story', title: '', content: '' });
      alert('Post created! Waiting for approval from parent/teacher.');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleReact = async (postId, emoji) => {
    try {
      await communityAPI.reactToPost(postId, emoji);
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  const emojis = ['❤️', '👍', '⭐', '😊', '🎉', '👏'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-6xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          ⭐
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(user.role === 'kid' ? '/dashboard/kid' : user.role === 'parent' ? '/dashboard/parent' : '/dashboard/teacher')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Dashboard
        </button>
        
        <div className="card bg-gradient-to-r from-pink-400 to-purple-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Community 🎨</h1>
              <p className="text-xl">Share your creativity with friends!</p>
            </div>
            {user.role === 'kid' && (
              <motion.button
                className="bg-white text-pink-600 px-6 py-3 rounded-full font-bold flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="w-5 h-5" />
                Create Post
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-2xl text-gray-600 font-bold">
            No posts yet. Be the first to share something!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              className="card bg-gradient-to-br from-white to-gray-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">
                  {post.author_avatar ? 
                    ({'robot1': '🤖', 'robot2': '🦾', 'unicorn': '🦄', 'dragon': '🐉'}[post.author_avatar] || '👦') 
                    : '👦'
                  }
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{post.author_name}</h3>
                  <span className="text-sm text-gray-500 bg-primary-100 px-2 py-1 rounded-full">
                    {post.post_type}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h4>
                <p className="text-gray-700">{post.content}</p>
              </div>

              {/* Reactions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-gray-200">
                {emojis.map((emoji, i) => (
                  <motion.button
                    key={i}
                    className="text-2xl hover:scale-125 transition-transform bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReact(post.id, emoji)}
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>
              
              <div className="mt-2 text-sm text-gray-500">
                {post.reaction_count || 0} reactions
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              className="card max-w-2xl w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Create a Post 📝</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              {/* Post Type Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-3 text-lg">
                  Post Type:
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'story', label: 'Story', emoji: '📖' },
                    { value: 'drawing', label: 'Drawing', emoji: '🎨' },
                    { value: 'photo', label: 'Photo', emoji: '📸' }
                  ].map((type) => (
                    <motion.button
                      key={type.value}
                      className={`p-4 rounded-2xl border-4 font-bold ${
                        newPost.postType === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-300 bg-white'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNewPost({ ...newPost, postType: type.value })}
                    >
                      <div className="text-4xl mb-2">{type.emoji}</div>
                      <div>{type.label}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  Title:
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="input-field"
                  placeholder="Give your post a fun title!"
                  maxLength={100}
                />
              </div>

              {/* Content */}
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  Content:
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-6 py-4 rounded-3xl border-4 border-primary-300 focus:border-primary-500 focus:outline-none text-lg font-semibold resize-none"
                  placeholder="Share your story, describe your drawing, or tell us about your photo!"
                  rows={6}
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-2">
                  {newPost.content.length}/500 characters
                </p>
              </div>

              {/* Info Message */}
              <div className="bg-yellow-50 border-4 border-yellow-300 rounded-2xl p-4 mb-6">
                <p className="text-gray-700 font-semibold">
                  ℹ️ Your post will be reviewed by a parent or teacher before it appears in the community!
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <motion.button
                  className="flex-1 btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCreatePost}
                  disabled={!newPost.title || !newPost.content}
                >
                  <Send className="w-5 h-5" />
                  Submit Post
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safety Message */}
      <motion.div
        className="mt-8 card bg-gradient-to-r from-green-400 to-blue-500 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">🛡️</div>
        <p className="text-2xl font-bold">
          This is a safe space! Be kind and respectful to everyone! 💖
        </p>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
