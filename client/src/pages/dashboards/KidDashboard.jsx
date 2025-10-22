import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Award,
  BookOpen,
  Gamepad2,
  Users,
  Trophy,
  LogOut,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { progressAPI } from '../../utils/api';
import Confetti from 'react-confetti';
import ParentKidLink from '../../components/ParentKidLink';

const KidDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await progressAPI.getProgress(user.id);
      setProgress(response.data);
      
      // Show confetti if user has achievements
      if (response.data.stats.totalStars > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const avatars = {
    robot1: '🤖',
    robot2: '🦾',
    unicorn: '🦄',
    dragon: '🐉',
    cat: '🐱',
    dog: '🐶',
    lion: '🦁',
    panda: '🐼'
  };

  const menuItems = [
    {
      title: 'Learning',
      icon: BookOpen,
      path: '/learning',
      color: 'from-blue-400 to-blue-600',
      emoji: '📚'
    },
    {
      title: 'Games',
      icon: Gamepad2,
      path: '/games',
      color: 'from-green-400 to-green-600',
      emoji: '🎮'
    },
    {
      title: 'Quizzes',
      icon: Sparkles,
      path: '/quizzes',
      color: 'from-purple-400 to-purple-600',
      emoji: '✨'
    },
    {
      title: 'Community',
      icon: Users,
      path: '/community',
      color: 'from-pink-400 to-pink-600',
      emoji: '🎨'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header */}
      <motion.div
        className="card mb-8 bg-gradient-to-r from-primary-400 to-accent-500 text-white"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              className="text-6xl"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {avatars[user.avatar] || '🤖'}
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome back, {user.name}! 🎉
              </h1>
              <p className="text-xl opacity-90">Ready for more adventures?</p>
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
              Link Parent
            </motion.button>
            <motion.button
              className="bg-white text-primary-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100"
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="card bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl opacity-90">Total Stars</p>
              <p className="text-5xl font-bold">{progress?.stats.totalStars || 0}</p>
            </div>
            <Star className="w-16 h-16" fill="currentColor" />
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-purple-400 to-pink-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl opacity-90">Badges Earned</p>
              <p className="text-5xl font-bold">{progress?.stats.totalBadges || 0}</p>
            </div>
            <Award className="w-16 h-16" />
          </div>
        </motion.div>

        <motion.div
          className="card bg-gradient-to-br from-green-400 to-blue-500 text-white"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl opacity-90">Completed</p>
              <p className="text-5xl font-bold">{progress?.stats.completedTopics || 0}</p>
            </div>
            <Trophy className="w-16 h-16" />
          </div>
        </motion.div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            className={`card bg-gradient-to-br ${item.color} text-white cursor-pointer`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(item.path)}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <item.icon className="w-8 h-8 mx-auto" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Badges */}
      {progress?.badges && progress.badges.length > 0 && (
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-8 h-8 text-primary-500" />
            Your Awesome Badges! 🏆
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {progress.badges.slice(0, 6).map((badge, index) => (
              <motion.div
                key={badge.id}
                className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 text-center text-white"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <div className="text-4xl mb-2">🏅</div>
                <p className="font-bold text-sm">{badge.badge_name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Motivational Message */}
      <motion.div
        className="mt-8 card bg-gradient-to-r from-blue-400 to-purple-500 text-white text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">🌟</div>
        <p className="text-2xl font-bold">
          Keep learning and growing! You're doing amazing! 🚀
        </p>
      </motion.div>

      {/* Link Modal */}
      <AnimatePresence>
        {showLinkModal && (
          <ParentKidLink onClose={() => setShowLinkModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KidDashboard;
