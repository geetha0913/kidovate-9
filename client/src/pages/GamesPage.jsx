import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Trophy, RefreshCw } from 'lucide-react';
import Confetti from 'react-confetti';
import useAuthStore from '../store/authStore';
import { progressAPI, activitiesAPI } from '../utils/api';

const GamesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const games = [
    {
      id: 'memory',
      title: 'Memory Match',
      emoji: '🎴',
      description: 'Match the pairs!',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'math-puzzle',
      title: 'Math Puzzle',
      emoji: '🧮',
      description: 'Solve math problems!',
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'word-match',
      title: 'Word Match',
      emoji: '📝',
      description: 'Match words with pictures!',
      color: 'from-green-400 to-green-600'
    }
  ];

  // Memory Game Logic
  const initMemoryGame = () => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        flipped: false,
        matched: false
      }));
    
    setGameState({
      cards,
      flippedCards: [],
      moves: 0,
      matches: 0
    });
  };

  const handleMemoryCardClick = (cardId) => {
    if (!gameState) return;
    
    const { cards, flippedCards } = gameState;
    const card = cards.find(c => c.id === cardId);
    
    if (card.flipped || card.matched || flippedCards.length >= 2) return;
    
    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, flipped: true } : c
    );
    const newFlippedCards = [...flippedCards, card];
    
    setGameState({
      ...gameState,
      cards: newCards,
      flippedCards: newFlippedCards,
      moves: gameState.moves + 1
    });
    
    if (newFlippedCards.length === 2) {
      setTimeout(() => {
        checkMemoryMatch(newFlippedCards);
      }, 1000);
    }
  };

  const checkMemoryMatch = (flippedCards) => {
    const [card1, card2] = flippedCards;
    const isMatch = card1.emoji === card2.emoji;
    
    const newCards = gameState.cards.map(c => {
      if (c.id === card1.id || c.id === card2.id) {
        return isMatch
          ? { ...c, matched: true, flipped: true }
          : { ...c, flipped: false };
      }
      return c;
    });
    
    const newMatches = isMatch ? gameState.matches + 1 : gameState.matches;
    
    setGameState({
      ...gameState,
      cards: newCards,
      flippedCards: [],
      matches: newMatches
    });
    
    if (isMatch) {
      setScore(score + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
      
      if (newMatches === 8) {
        completeGame('Memory Match', score + 10);
      }
    }
  };

  // Math Puzzle Logic
  const initMathGame = () => {
    const generateProblem = () => {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      const operations = ['+', '-'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      
      let answer;
      if (operation === '+') {
        answer = num1 + num2;
      } else {
        answer = Math.max(num1, num2) - Math.min(num1, num2);
      }
      
      const wrongAnswers = [
        answer + 1,
        answer - 1,
        answer + 2
      ].filter(a => a >= 0);
      
      const options = [answer, ...wrongAnswers.slice(0, 3)]
        .sort(() => Math.random() - 0.5);
      
      return {
        num1: operation === '-' ? Math.max(num1, num2) : num1,
        num2: operation === '-' ? Math.min(num1, num2) : num2,
        operation,
        answer,
        options,
        userAnswer: null
      };
    };
    
    setGameState({
      problem: generateProblem(),
      correctAnswers: 0,
      totalQuestions: 0
    });
  };

  const handleMathAnswer = async (selectedAnswer) => {
    const isCorrect = selectedAnswer === gameState.problem.answer;
    
    setGameState({
      ...gameState,
      problem: { ...gameState.problem, userAnswer: selectedAnswer }
    });
    
    if (isCorrect) {
      setScore(score + 10);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1000);
      
      setTimeout(() => {
        const newCorrect = gameState.correctAnswers + 1;
        const newTotal = gameState.totalQuestions + 1;
        
        if (newTotal >= 5) {
          completeGame('Math Puzzle', score + 10);
        } else {
          setGameState({
            problem: generateNewProblem(),
            correctAnswers: newCorrect,
            totalQuestions: newTotal
          });
        }
      }, 1500);
    } else {
      setTimeout(() => {
        setGameState({
          ...gameState,
          problem: { ...gameState.problem, userAnswer: null }
        });
      }, 1500);
    }
  };

  const generateNewProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    if (operation === '+') {
      answer = num1 + num2;
    } else {
      answer = Math.max(num1, num2) - Math.min(num1, num2);
    }
    
    const wrongAnswers = [answer + 1, answer - 1, answer + 2].filter(a => a >= 0);
    const options = [answer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5);
    
    return {
      num1: operation === '-' ? Math.max(num1, num2) : num1,
      num2: operation === '-' ? Math.min(num1, num2) : num2,
      operation,
      answer,
      options,
      userAnswer: null
    };
  };

  const completeGame = async (gameName, finalScore) => {
    try {
      await progressAPI.updateProgress({
        subject: 'Games',
        topic: gameName,
        score: finalScore,
        stars: Math.floor(finalScore / 10)
      });
      
      await activitiesAPI.logActivity({
        activityType: 'game',
        activityName: gameName,
        details: { score: finalScore }
      });
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  };

  const startGame = (gameId) => {
    setSelectedGame(gameId);
    setScore(0);
    
    if (gameId === 'memory') {
      initMemoryGame();
    } else if (gameId === 'math-puzzle') {
      initMathGame();
    }
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameState(null);
    setScore(0);
  };

  if (selectedGame === 'memory' && gameState) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}
        
        <div className="mb-8">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Games
          </button>
          
          <div className="card bg-gradient-to-r from-pink-400 to-pink-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Memory Match 🎴</h1>
                <p className="text-xl">Moves: {gameState.moves} | Matches: {gameState.matches}/8</p>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <Star className="w-6 h-6" fill="currentColor" />
                <span className="text-2xl font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {gameState.cards.map((card) => (
            <motion.div
              key={card.id}
              className={`aspect-square rounded-2xl cursor-pointer flex items-center justify-center text-5xl ${
                card.flipped || card.matched
                  ? 'bg-white'
                  : 'bg-gradient-to-br from-primary-400 to-primary-600'
              }`}
              whileHover={{ scale: card.matched ? 1 : 1.05 }}
              whileTap={{ scale: card.matched ? 1 : 0.95 }}
              onClick={() => handleMemoryCardClick(card.id)}
            >
              {card.flipped || card.matched ? card.emoji : '❓'}
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedGame === 'math-puzzle' && gameState) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        {showConfetti && <Confetti recycle={false} numberOfPieces={100} />}
        
        <div className="mb-8">
          <button
            onClick={resetGame}
            className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold text-lg mb-4"
          >
            <ArrowLeft className="w-6 h-6" />
            Back to Games
          </button>
          
          <div className="card bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Math Puzzle 🧮</h1>
                <p className="text-xl">Question {gameState.totalQuestions + 1} of 5</p>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <Star className="w-6 h-6" fill="currentColor" />
                <span className="text-2xl font-bold">{score}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8">
            <p className="text-6xl font-bold text-center text-gray-800">
              {gameState.problem.num1} {gameState.problem.operation} {gameState.problem.num2} = ?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gameState.problem.options.map((option, index) => (
              <motion.button
                key={index}
                className={`p-6 rounded-2xl text-4xl font-bold ${
                  gameState.problem.userAnswer === null
                    ? 'bg-white hover:bg-primary-100 text-gray-800 border-4 border-gray-300'
                    : gameState.problem.userAnswer === option
                    ? option === gameState.problem.answer
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={gameState.problem.userAnswer === null ? { scale: 1.05 } : {}}
                whileTap={gameState.problem.userAnswer === null ? { scale: 0.95 } : {}}
                onClick={() => gameState.problem.userAnswer === null && handleMathAnswer(option)}
                disabled={gameState.problem.userAnswer !== null}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
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
            🎮
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Fun Games</h1>
          <p className="text-xl">Choose a game and start playing!</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className={`card bg-gradient-to-br ${game.color} text-white cursor-pointer`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: index * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame(game.id)}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{game.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{game.title}</h3>
              <p className="text-lg opacity-90">{game.description}</p>
              <motion.div
                className="mt-4 font-bold text-xl"
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Play Now! →
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
