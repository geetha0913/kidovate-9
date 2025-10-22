import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Star,
  Award,
  TrendingUp,
  LogOut,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { progressAPI, communityAPI } from '../../utils/api';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [students, setStudents] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsRes, postsRes] = await Promise.all([
        progressAPI.getChildren(),
        communityAPI.getPendingPosts()
      ]);
      setStudents(studentsRes.data.children);
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

  // Calculate class statistics
  const totalStars = students.reduce((sum, s) => sum + (parseInt(s.total_stars) || 0), 0);
  const totalBadges = students.reduce((sum, s) => sum + (parseInt(s.total_badges) || 0), 0);
  const avgStars = students.length > 0 ? Math.round(totalStars / students.length) : 0;

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
        className="card mb-8 bg-gradient-to-r from-purple-400 to-indigo-600 text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl">👩‍🏫</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Teacher Dashboard
              </h1>
              <p className="text-xl opacity-90">Welcome, {user.name}!</p>
            </div>
          </div>
          <motion.button
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </motion.button>
        </div>
      </motion.div>

      {/* Class Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="card bg-gradient-to-br from-blue-400 to-blue-600 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Total Students</p>
              <p className="text-4xl font-bold">{students.length}</p>
            </div>
            <Users className="w-12 h-12" />
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Total Stars</p>
              <p className="text-4xl font-bold">{totalStars}</p>
            </div>
            <Star className="w-12 h-12" fill="currentColor" />
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-purple-400 to-pink-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Total Badges</p>
              <p className="text-4xl font-bold">{totalBadges}</p>
            </div>
            <Award className="w-12 h-12" />
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-green-400 to-teal-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90">Avg Stars</p>
              <p className="text-4xl font-bold">{avgStars}</p>
            </div>
            <BarChart3 className="w-12 h-12" />
          </div>
        </motion.div>
      </div>

      {/* Students Progress */}
      <motion.div
        className="card mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Users className="w-8 h-8 text-primary-500" />
          Student Progress Overview
        </h2>

        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-gray-600">
              No students registered yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-4 border-indigo-200"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">🎓</div>
                  <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                      <span className="font-semibold">Stars</span>
                    </div>
                    <span className="text-2xl font-bold text-primary-600">
                      {student.total_stars || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold">Badges</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">
                      {student.total_badges || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="font-semibold">Activities</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {student.total_activities || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Pending Posts for Moderation */}
      {pendingPosts.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="w-8 h-8 text-orange-500" />
            Posts for Moderation ({pendingPosts.length})
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

      {/* Motivational Message */}
      <motion.div
        className="mt-8 card bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">🌟</div>
        <p className="text-2xl font-bold">
          Thank you for inspiring young minds! Keep up the great work! 📚
        </p>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;
