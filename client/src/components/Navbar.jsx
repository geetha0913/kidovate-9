import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) return null;

  return (
    <motion.nav
      className="bg-white shadow-lg sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
          >
            <span className="text-4xl">🚀</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Kid Quest Adventures
            </span>
          </motion.div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary-100 to-accent-100 px-4 py-2 rounded-full">
              <span className="text-2xl">
                {user?.role === 'kid' ? '👦' : user?.role === 'parent' ? '👨‍👩‍👧' : '👩‍🏫'}
              </span>
              <span className="font-bold text-gray-800">{user?.name}</span>
            </div>

            <motion.button
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-3 rounded-full"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                if (user?.role === 'kid') navigate('/dashboard/kid');
                else if (user?.role === 'parent') navigate('/dashboard/parent');
                else navigate('/dashboard/teacher');
              }}
            >
              <Home className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-full"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
