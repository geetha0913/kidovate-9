import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Gamepad2, Users, Star, Rocket } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <Star
              className="text-yellow-300 opacity-30"
              size={Math.random() * 30 + 10}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="inline-block mb-6"
            variants={floatingVariants}
            animate="animate"
          >
            <Rocket className="w-24 h-24 text-primary-500 mx-auto" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 mb-4">
            Kid Quest Adventures
          </h1>
          
          <motion.p
            className="text-2xl md:text-3xl text-gray-700 font-semibold"
            variants={itemVariants}
          >
            🎉 Learn, Play, and Grow Together! 🎉
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
        >
          {[
            {
              icon: BookOpen,
              title: 'Learning',
              desc: 'Fun lessons in Math, Science & More!',
              color: 'from-blue-400 to-blue-600',
              delay: 0
            },
            {
              icon: Gamepad2,
              title: 'Games',
              desc: 'Play exciting educational games!',
              color: 'from-green-400 to-green-600',
              delay: 0.1
            },
            {
              icon: Sparkles,
              title: 'Quizzes',
              desc: 'Test your knowledge and earn stars!',
              color: 'from-purple-400 to-purple-600',
              delay: 0.2
            },
            {
              icon: Users,
              title: 'Community',
              desc: 'Share your creations with friends!',
              color: 'from-pink-400 to-pink-600',
              delay: 0.3
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="card bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl cursor-pointer"
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 mx-auto`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button
            className="btn-primary"
            whileHover={{ scale: 1.1, rotate: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/register')}
          >
            🚀 Start Your Adventure!
          </motion.button>
          
          <motion.button
            className="btn-secondary"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/login')}
          >
            🔑 Login
          </motion.button>
        </motion.div>

        {/* Mascot Section */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block text-8xl"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            🤖
          </motion.div>
          <motion.div
            className="mt-4 bg-white rounded-3xl p-6 inline-block shadow-xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
          >
            <p className="text-2xl font-bold text-gray-800">
              "Hi! I'm Robo! Let's learn and have fun together!"
            </p>
          </motion.div>
        </motion.div>

        {/* Features List */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {[
            { emoji: '⭐', title: 'Earn Stars & Badges', desc: 'Complete lessons and collect rewards!' },
            { emoji: '👨‍👩‍👧', title: 'Parent Dashboard', desc: 'Track your child\'s progress easily!' },
            { emoji: '🎨', title: 'Safe Community', desc: 'Share drawings and stories safely!' }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="card text-center"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <div className="text-6xl mb-4">{item.emoji}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
