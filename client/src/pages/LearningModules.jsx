import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Beaker, Users as UsersIcon, Lightbulb } from 'lucide-react';

const LearningModules = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'math',
      title: 'Math',
      emoji: '🔢',
      icon: BookOpen,
      description: 'Learn counting, addition, subtraction & more!',
      color: 'from-blue-400 to-blue-600',
      topics: ['Counting', 'Addition', 'Subtraction', 'Shapes', 'Patterns']
    },
    {
      id: 'science',
      title: 'Science',
      emoji: '🔬',
      icon: Beaker,
      description: 'Explore plants, animals, Earth & experiments!',
      color: 'from-green-400 to-green-600',
      topics: ['Plants', 'Animals', 'Earth', 'Water Cycle', 'Simple Machines']
    },
    {
      id: 'social',
      title: 'Social Studies',
      emoji: '🏘️',
      icon: UsersIcon,
      description: 'Learn about family, community & respect!',
      color: 'from-purple-400 to-purple-600',
      topics: ['Family', 'Community Helpers', 'Respect', 'Friendship', 'Sharing']
    },
    {
      id: 'awareness',
      title: 'Life Skills',
      emoji: '💡',
      icon: Lightbulb,
      description: 'Good habits, safety & healthy living!',
      color: 'from-orange-400 to-orange-600',
      topics: ['Good Habits', 'Traffic Rules', 'Cleanliness', 'Healthy Food', 'Safety']
    }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => navigate('/dashboard/kid')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Dashboard
        </button>
        
        <div className="card bg-gradient-to-r from-primary-400 to-accent-500 text-white text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            📚
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Learning Modules</h1>
          <p className="text-xl">Choose a subject to start learning!</p>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            className={`card bg-gradient-to-br ${subject.color} text-white cursor-pointer`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/learning/${subject.id}`)}
          >
            <div className="flex items-start gap-4 mb-4">
              <motion.div
                className="text-6xl"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {subject.emoji}
              </motion.div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{subject.title}</h2>
                <p className="text-lg opacity-90">{subject.description}</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-20 rounded-2xl p-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-2">Topics:</h3>
              <div className="flex flex-wrap gap-2">
                {subject.topics.map((topic, i) => (
                  <span
                    key={i}
                    className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <motion.div
              className="mt-4 text-center font-bold text-xl"
              animate={{
                x: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              Click to Start! →
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Motivational Section */}
      <motion.div
        className="mt-8 card bg-gradient-to-r from-pink-400 to-purple-500 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">🌟</div>
        <p className="text-2xl font-bold">
          Every lesson you complete makes you smarter! Keep going! 🚀
        </p>
      </motion.div>
    </div>
  );
};

export default LearningModules;
