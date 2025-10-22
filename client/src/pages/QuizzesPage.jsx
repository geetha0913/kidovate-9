import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, CheckCircle, XCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import useAuthStore from '../store/authStore';
import { progressAPI, activitiesAPI } from '../utils/api';

const QuizzesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const quizzes = [
    {
      id: 'math',
      title: 'Math Quiz',
      emoji: '🔢',
      color: 'from-blue-400 to-blue-600',
      questions: [
        {
          question: 'What is 5 + 3?',
          options: ['6', '7', '8', '9'],
          correct: 2
        },
        {
          question: 'What is 10 - 4?',
          options: ['5', '6', '7', '8'],
          correct: 1
        },
        {
          question: 'How many sides does a triangle have?',
          options: ['2', '3', '4', '5'],
          correct: 1
        },
        {
          question: 'What is 2 × 3?',
          options: ['4', '5', '6', '7'],
          correct: 2
        },
        {
          question: 'What comes after 9?',
          options: ['8', '10', '11', '12'],
          correct: 1
        }
      ]
    },
    {
      id: 'science',
      title: 'Science Quiz',
      emoji: '🔬',
      color: 'from-green-400 to-green-600',
      questions: [
        {
          question: 'What do plants need to grow?',
          options: ['Only water', 'Water and sunlight', 'Only soil', 'Nothing'],
          correct: 1
        },
        {
          question: 'Which animal can fly?',
          options: ['Dog', 'Cat', 'Bird', 'Fish'],
          correct: 2
        },
        {
          question: 'What color is the sky?',
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          correct: 1
        },
        {
          question: 'How many legs does a spider have?',
          options: ['6', '8', '10', '12'],
          correct: 1
        },
        {
          question: 'What do we breathe?',
          options: ['Water', 'Air', 'Food', 'Soil'],
          correct: 1
        }
      ]
    },
    {
      id: 'general',
      title: 'General Knowledge',
      emoji: '🌟',
      color: 'from-purple-400 to-purple-600',
      questions: [
        {
          question: 'How many days are in a week?',
          options: ['5', '6', '7', '8'],
          correct: 2
        },
        {
          question: 'What color do you get when you mix red and yellow?',
          options: ['Green', 'Orange', 'Purple', 'Blue'],
          correct: 1
        },
        {
          question: 'Which is the biggest animal?',
          options: ['Elephant', 'Lion', 'Blue Whale', 'Giraffe'],
          correct: 2
        },
        {
          question: 'How many months are in a year?',
          options: ['10', '11', '12', '13'],
          correct: 2
        },
        {
          question: 'What do bees make?',
          options: ['Milk', 'Honey', 'Butter', 'Cheese'],
          correct: 1
        }
      ]
    }
  ];

  const handleAnswer = (selectedIndex) => {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const question = quiz.questions[currentQuestion];
    const isCorrect = selectedIndex === question.correct;
    
    const newAnswers = [...answers, { questionIndex: currentQuestion, selectedIndex, isCorrect }];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(score + 20);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }
    
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        finishQuiz(newAnswers);
      }
    }, 1500);
  };

  const finishQuiz = async (finalAnswers) => {
    setShowResult(true);
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const finalScore = correctCount * 20;
    
    try {
      await progressAPI.updateProgress({
        subject: 'Quizzes',
        topic: quizzes.find(q => q.id === selectedQuiz).title,
        score: finalScore,
        stars: Math.floor(finalScore / 20)
      });
      
      await activitiesAPI.logActivity({
        activityType: 'quiz',
        activityName: quizzes.find(q => q.id === selectedQuiz).title,
        details: { score: finalScore, correct: correctCount, total: finalAnswers.length }
      });
    } catch (error) {
      console.error('Failed to save quiz progress:', error);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResult(false);
  };

  const startQuiz = (quizId) => {
    setSelectedQuiz(quizId);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setShowResult(false);
  };

  if (selectedQuiz && !showResult) {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const question = quiz.questions[currentQuestion];
    const currentAnswer = answers.find(a => a.questionIndex === currentQuestion);

    return (
      <div className="min-h-screen p-4 md:p-8">
        {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}
        
        <div className="mb-8">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Quizzes
          </button>
          
          <div className={`card bg-gradient-to-r ${quiz.color} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">{quiz.title} {quiz.emoji}</h1>
                <p className="text-xl">Question {currentQuestion + 1} of {quiz.questions.length}</p>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <Star className="w-6 h-6" fill="currentColor" />
                <span className="text-2xl font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            className="card max-w-3xl mx-auto"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8">
              <p className="text-3xl font-bold text-center text-gray-800">
                {question.question}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
                    currentAnswer
                      ? currentAnswer.selectedIndex === index
                        ? index === question.correct
                          ? 'bg-green-500 text-white border-4 border-green-600'
                          : 'bg-red-500 text-white border-4 border-red-600'
                        : index === question.correct
                        ? 'bg-green-500 text-white border-4 border-green-600'
                        : 'bg-gray-200 text-gray-500 border-4 border-gray-300'
                      : 'bg-white hover:bg-primary-100 text-gray-800 border-4 border-gray-300'
                  }`}
                  whileHover={!currentAnswer ? { scale: 1.05 } : {}}
                  whileTap={!currentAnswer ? { scale: 0.95 } : {}}
                  onClick={() => !currentAnswer && handleAnswer(index)}
                  disabled={currentAnswer !== undefined}
                >
                  {option}
                  {currentAnswer && index === question.correct && (
                    <CheckCircle className="inline ml-2 w-6 h-6" />
                  )}
                  {currentAnswer && currentAnswer.selectedIndex === index && index !== question.correct && (
                    <XCircle className="inline ml-2 w-6 h-6" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (showResult) {
    const quiz = quizzes.find(q => q.id === selectedQuiz);
    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);

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
            {percentage >= 80 ? '🏆' : percentage >= 60 ? '🌟' : '💪'}
          </motion.div>
          
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500 mb-4">
            {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Great Job!' : 'Keep Trying!'}
          </h1>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 mb-6">
            <p className="text-3xl font-bold text-gray-800 mb-4">
              You scored {correctCount} out of {quiz.questions.length}
            </p>
            <p className="text-5xl font-bold text-primary-600">{percentage}%</p>
          </div>

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
              onClick={() => startQuiz(selectedQuiz)}
            >
              Try Again
            </motion.button>
            <motion.button
              className="btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
            >
              More Quizzes
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mb-8">
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
            ✨
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Quiz Time!</h1>
          <p className="text-xl">Test your knowledge and earn stars!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map((quiz, index) => (
          <motion.div
            key={quiz.id}
            className={`card bg-gradient-to-br ${quiz.color} text-white cursor-pointer`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startQuiz(quiz.id)}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{quiz.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{quiz.title}</h3>
              <p className="text-lg opacity-90">{quiz.questions.length} Questions</p>
              <motion.div
                className="mt-4 font-bold text-xl"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Start Quiz! →
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 card bg-gradient-to-r from-pink-400 to-purple-500 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-5xl mb-4">🎯</div>
        <p className="text-2xl font-bold">
          Challenge yourself and show what you've learned! 🚀
        </p>
      </motion.div>
    </div>
  );
};

export default QuizzesPage;
