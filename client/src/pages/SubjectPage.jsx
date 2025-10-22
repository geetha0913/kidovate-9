import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Award, Volume2, CheckCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import useAuthStore from '../store/authStore';
import { progressAPI, activitiesAPI } from '../utils/api';

const SubjectPage = () => {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentTopic, setCurrentTopic] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completed, setCompleted] = useState(false);

  const subjectData = {
    math: {
      title: 'Math',
      emoji: '🔢',
      color: 'from-blue-400 to-blue-600',
      topics: [
        {
          title: 'Counting 1-10',
          content: 'Let\'s learn to count from 1 to 10! Count with me!',
          visual: '1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣ 9️⃣ 🔟',
          quiz: {
            question: 'What comes after 5?',
            options: ['4', '6', '7', '8'],
            correct: 1
          }
        },
        {
          title: 'Addition',
          content: 'Addition means putting things together! 2 + 3 = 5',
          visual: '🍎🍎 + 🍎🍎🍎 = 🍎🍎🍎🍎🍎',
          quiz: {
            question: '3 + 2 = ?',
            options: ['4', '5', '6', '7'],
            correct: 1
          }
        },
        {
          title: 'Subtraction',
          content: 'Subtraction means taking away! 5 - 2 = 3',
          visual: '🍎🍎🍎🍎🍎 - 🍎🍎 = 🍎🍎🍎',
          quiz: {
            question: '7 - 3 = ?',
            options: ['3', '4', '5', '6'],
            correct: 1
          }
        }
      ]
    },
    science: {
      title: 'Science',
      emoji: '🔬',
      color: 'from-green-400 to-green-600',
      topics: [
        {
          title: 'Plants',
          content: 'Plants need water, sunlight, and soil to grow! They give us oxygen!',
          visual: '🌱 → 🌿 → 🌳',
          quiz: {
            question: 'What do plants need to grow?',
            options: ['Only water', 'Water, sunlight & soil', 'Only sunlight', 'Nothing'],
            correct: 1
          }
        },
        {
          title: 'Animals',
          content: 'Animals can be pets, farm animals, or wild animals! They all need food and care.',
          visual: '🐶 🐱 🐮 🦁 🐘',
          quiz: {
            question: 'Which is a pet animal?',
            options: ['Lion', 'Dog', 'Elephant', 'Tiger'],
            correct: 1
          }
        },
        {
          title: 'Water Cycle',
          content: 'Water goes up as vapor, forms clouds, and comes down as rain!',
          visual: '💧 → ☁️ → 🌧️ → 💧',
          quiz: {
            question: 'What happens when water heats up?',
            options: ['It freezes', 'It evaporates', 'It disappears', 'Nothing'],
            correct: 1
          }
        }
      ]
    },
    social: {
      title: 'Social Studies',
      emoji: '🏘️',
      color: 'from-purple-400 to-purple-600',
      topics: [
        {
          title: 'Family',
          content: 'Family members love and care for each other! Mom, Dad, siblings, grandparents!',
          visual: '👨‍👩‍👧‍👦 👴👵',
          quiz: {
            question: 'Who are part of your family?',
            options: ['Only parents', 'Parents & siblings', 'Parents, siblings & grandparents', 'Only friends'],
            correct: 2
          }
        },
        {
          title: 'Community Helpers',
          content: 'People who help us: doctors, teachers, firefighters, police officers!',
          visual: '👨‍⚕️ 👩‍🏫 👨‍🚒 👮‍♀️',
          quiz: {
            question: 'Who helps us when we are sick?',
            options: ['Teacher', 'Doctor', 'Firefighter', 'Police'],
            correct: 1
          }
        },
        {
          title: 'Respect & Kindness',
          content: 'Always be kind and respectful to everyone! Say please and thank you!',
          visual: '🤝 ❤️ 😊',
          quiz: {
            question: 'What should we say when someone helps us?',
            options: ['Nothing', 'Thank you', 'Go away', 'I don\'t care'],
            correct: 1
          }
        }
      ]
    },
    awareness: {
      title: 'Life Skills',
      emoji: '💡',
      color: 'from-orange-400 to-orange-600',
      topics: [
        {
          title: 'Good Habits',
          content: 'Brush your teeth, wash your hands, and keep yourself clean!',
          visual: '🪥 🧼 🚿',
          quiz: {
            question: 'When should we wash our hands?',
            options: ['Never', 'Before eating', 'Only at night', 'Once a week'],
            correct: 1
          }
        },
        {
          title: 'Traffic Rules',
          content: 'Stop at red light, go at green light! Always use zebra crossing!',
          visual: '🚦 🚸',
          quiz: {
            question: 'What does a red traffic light mean?',
            options: ['Go', 'Stop', 'Run fast', 'Dance'],
            correct: 1
          }
        },
        {
          title: 'Healthy Food',
          content: 'Eat fruits, vegetables, and drink water! They make you strong!',
          visual: '🍎 🥕 🥦 💧',
          quiz: {
            question: 'Which is a healthy food?',
            options: ['Candy', 'Apple', 'Chips', 'Soda'],
            correct: 1
          }
        }
      ]
    }
  };

  const currentSubject = subjectData[subject];
  const topic = currentSubject?.topics[currentTopic];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleQuizAnswer = async (selectedIndex) => {
    setQuizAnswer(selectedIndex);
    const isCorrect = selectedIndex === topic.quiz.correct;
    
    if (isCorrect) {
      setScore(score + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      speak('Correct! Great job!');
      
      // Save progress
      try {
        await progressAPI.updateProgress({
          subject: currentSubject.title,
          topic: topic.title,
          score: 10,
          stars: 1
        });
        
        await activitiesAPI.logActivity({
          activityType: 'learning',
          activityName: `Completed ${topic.title}`,
          details: { subject: currentSubject.title, score: 10 }
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
      
      setTimeout(() => {
        if (currentTopic < currentSubject.topics.length - 1) {
          setCurrentTopic(currentTopic + 1);
          setShowQuiz(false);
          setQuizAnswer(null);
        } else {
          setCompleted(true);
        }
      }, 2000);
    } else {
      speak('Try again!');
      setTimeout(() => setQuizAnswer(null), 1500);
    }
  };

  if (!currentSubject) {
    return <div>Subject not found</div>;
  }

  if (completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Confetti recycle={false} numberOfPieces={500} />
        <motion.div
          className="card text-center max-w-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <motion.div
            className="text-8xl mb-6"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            🏆
          </motion.div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 mb-4">
            Amazing Work!
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            You completed all {currentSubject.title} lessons!
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-yellow-400 rounded-full p-4">
              <Star className="w-12 h-12 text-white" fill="currentColor" />
            </div>
            <span className="text-4xl font-bold text-primary-600">
              +{score} Stars!
            </span>
          </div>
          <div className="flex gap-4 justify-center">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learning')}
            >
              Learn More Subjects
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard/kid')}
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <button
          onClick={() => navigate('/learning')}
          className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
          Back to Subjects
        </button>
        
        <div className={`card bg-gradient-to-r ${currentSubject.color} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">{currentSubject.emoji}</div>
              <div>
                <h1 className="text-4xl font-bold">{currentSubject.title}</h1>
                <p className="text-xl">Lesson {currentTopic + 1} of {currentSubject.topics.length}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <Star className="w-6 h-6" fill="currentColor" />
                <span className="text-2xl font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentTopic + 1) / currentSubject.topics.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showQuiz ? (
          <motion.div
            key="lesson"
            className="card max-w-4xl mx-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{topic.title}</h2>
            
            <motion.div
              className="text-8xl text-center mb-8"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {topic.visual}
            </motion.div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-6">
              <p className="text-2xl text-gray-800 leading-relaxed">{topic.content}</p>
            </div>

            <div className="flex gap-4">
              <motion.button
                className="btn-secondary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speak(topic.content)}
              >
                <Volume2 className="w-6 h-6" />
                Listen
              </motion.button>
              
              <motion.button
                className="btn-primary flex-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuiz(true)}
              >
                Take Quiz! ✨
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            className="card max-w-4xl mx-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              Quiz Time! 🎯
            </h2>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
              <p className="text-3xl text-gray-800 font-bold text-center">
                {topic.quiz.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topic.quiz.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                    quizAnswer === null
                      ? 'bg-white hover:bg-primary-100 text-gray-800 border-4 border-gray-300'
                      : quizAnswer === index
                      ? index === topic.quiz.correct
                        ? 'bg-green-500 text-white border-4 border-green-600'
                        : 'bg-red-500 text-white border-4 border-red-600'
                      : 'bg-gray-200 text-gray-500 border-4 border-gray-300'
                  }`}
                  whileHover={quizAnswer === null ? { scale: 1.05 } : {}}
                  whileTap={quizAnswer === null ? { scale: 0.95 } : {}}
                  onClick={() => quizAnswer === null && handleQuizAnswer(index)}
                  disabled={quizAnswer !== null}
                >
                  {option}
                  {quizAnswer === index && index === topic.quiz.correct && (
                    <CheckCircle className="inline ml-2 w-8 h-8" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubjectPage;
