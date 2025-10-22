import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Star, Award, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const KidProgressView = ({ kid, onClose }) => {
  const { token } = useAuthStore();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKidProgress();
  }, [kid.id]);

  const fetchKidProgress = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/parent-kid/kid-progress/${kid.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setProgress(response.data);
    } catch (error) {
      console.error('Failed to fetch kid progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="bg-white rounded-3xl p-8">
          <div className="text-6xl">⏳</div>
          <p className="mt-4 text-gray-600">Loading progress...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {kid.name}'s Progress
          </h2>
          <p className="text-white/90 text-sm">Learning journey and achievements</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Total Stars</p>
                  <p className="text-3xl font-bold text-yellow-900">
                    {progress?.stats.totalStars || 0}
                  </p>
                </div>
                <Star className="text-yellow-600" size={40} fill="currentColor" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-800 font-medium">Completed</p>
                  <p className="text-3xl font-bold text-green-900">
                    {progress?.stats.completedLessons || 0}
                  </p>
                </div>
                <BookOpen className="text-green-600" size={40} />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-800 font-medium">Badges</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {progress?.stats.totalBadges || 0}
                  </p>
                </div>
                <Award className="text-purple-600" size={40} />
              </div>
            </motion.div>
          </div>

          {/* Recent Progress */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp size={24} />
              Recent Progress
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {progress?.progress.slice(0, 10).map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border-2 border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.subject} - {item.topic}
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {item.score}% | Stars: {item.stars} ⭐
                      </p>
                    </div>
                    {item.completed && (
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Badges */}
          {progress?.badges.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award size={24} />
                Earned Badges
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {progress.badges.map((badge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-gradient-to-br from-yellow-100 to-orange-100 p-4 rounded-xl text-center border-2 border-yellow-300"
                  >
                    <div className="text-4xl mb-2">🏆</div>
                    <p className="font-semibold text-sm text-gray-800">{badge.badge_name}</p>
                    <p className="text-xs text-gray-600">{badge.badge_type}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={24} />
              Recent Activities
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {progress?.activities.slice(0, 10).map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {activity.activity_name}
                      </p>
                      <p className="text-xs text-gray-600">{activity.activity_type}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default KidProgressView;
