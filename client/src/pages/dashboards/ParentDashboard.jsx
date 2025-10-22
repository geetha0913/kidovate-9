import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Star,
  Award,
  TrendingUp,
  LogOut,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { progressAPI, communityAPI } from '../../utils/api';
import ParentKidLink from '../../components/ParentKidLink';
import KidProgressView from '../../components/KidProgressView';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [children, setChildren] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedKid, setSelectedKid] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [kidsRes, postsRes] = await Promise.all([
        axios.get(`${API_URL}/parent-kid/my-kids`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        communityAPI.getPendingPosts()
      ]);
      setChildren(kidsRes.data.kids);
      setPendingPosts(postsRes.data.posts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await communityAPI.approvePost(postId);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to approve post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await communityAPI.deletePost(postId);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        className="card mb-8 bg-gradient-to-r from-green-400 to-blue-500 text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">👨‍👩‍👧</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Parent Dashboard
              </h1>
              <p className="text-xl opacity-90">Welcome, {user.name}!</p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLinkModal(true)}
            >
              <LinkIcon className="w-5 h-5" />
              Link Kid
            </motion.button>
            <motion.button
              className="bg-white text-green-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Children Progress */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-8 h-8 text-primary-500" />
          Your Children's Progress
        </h2>

        {children.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👶</div>
            <p className="text-xl text-gray-600 mb-4">
              No kids linked yet!
            </p>
            <motion.button
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold"
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowLinkModal(true)}
            >
              Link Your Kid
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children.map((child, index) => (
              <motion.div
                key={child.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-4 border-blue-200"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">👦</div>
                  <h3 className="text-2xl font-bold text-gray-800">{child.name}</h3>
                  <p className="text-sm text-gray-600">{child.email}</p>
                </div>

                <motion.button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedKid(child)}
                >
                  <Eye className="w-5 h-5" />
                  View Progress
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pending Posts for Approval */}
      {pendingPosts.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-8 h-8 text-orange-500" />
            Posts Waiting for Approval ({pendingPosts.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border-4 border-orange-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    <p className="text-sm text-gray-600">By: {post.author_name}</p>
                  </div>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {post.post_type}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{post.content}</p>

                <div className="flex gap-3">
                  <motion.button
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-bold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprovePost(post.id)}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        className="mt-8 card bg-gradient-to-r from-purple-400 to-pink-500 text-white text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">💪</div>
        <p className="text-2xl font-bold">
          Keep supporting your child's learning journey! 🌟
        </p>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showLinkModal && (
          <ParentKidLink onClose={() => setShowLinkModal(false)} />
        )}
        {selectedKid && (
          <KidProgressView
            kid={selectedKid}
            onClose={() => setSelectedKid(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ParentDashboard;
