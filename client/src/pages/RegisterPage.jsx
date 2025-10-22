import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Users, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { authAPI } from '../utils/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'kid',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters!');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await authAPI.register(registerData);
      const { token, user } = response.data;
      
      login(user, token);
      
      // Redirect based on role
      if (user.role === 'kid') navigate('/dashboard/kid');
      else if (user.role === 'parent') navigate('/dashboard/parent');
      else if (user.role === 'teacher') navigate('/dashboard/teacher');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'kid', label: '👦 Kid (Ages 5-12)', emoji: '🎮', color: 'from-blue-400 to-blue-600' },
    { value: 'parent', label: '👨‍👩‍👧 Parent', emoji: '👪', color: 'from-green-400 to-green-600' },
    { value: 'teacher', label: '👩‍🏫 Teacher', emoji: '📚', color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="card">
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <motion.div
              className="inline-block text-6xl mb-4"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              🚀
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Join the Adventure!</h1>
            <p className="text-gray-600 text-lg">Create your account to start learning</p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="bg-red-100 border-4 border-red-400 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-lg">
                <User className="inline w-5 h-5 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Your awesome name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-lg">
                <Mail className="inline w-5 h-5 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  <Lock className="inline w-5 h-5 mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">
                  <Lock className="inline w-5 h-5 mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-bold mb-3 text-lg">
                <Users className="inline w-5 h-5 mr-2" />
                I am a...
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <motion.label
                    key={role.value}
                    className={`cursor-pointer ${
                      formData.role === role.value
                        ? 'ring-4 ring-primary-500'
                        : 'ring-2 ring-gray-300'
                    } rounded-2xl p-4 transition-all`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className="text-4xl mb-2">{role.emoji}</div>
                      <div className="font-bold text-gray-800">{role.label}</div>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <>
                  <UserPlus className="w-6 h-6" />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-lg">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 font-bold hover:text-primary-700 underline"
              >
                Login here!
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-gray-500 hover:text-gray-700 font-semibold"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
