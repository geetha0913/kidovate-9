# 🤝 Contributing to Kid Quest Adventures

Thank you for your interest in contributing to Kid Quest Adventures! This document provides guidelines for contributing to the project.

## 🎯 Ways to Contribute

### 1. Add New Learning Content
- Create new subjects or topics
- Add more quiz questions
- Design new games
- Write educational content

### 2. Improve Features
- Enhance existing games
- Add new animations
- Improve UI/UX
- Optimize performance

### 3. Fix Bugs
- Report bugs
- Fix existing issues
- Improve error handling
- Add validation

### 4. Documentation
- Improve README
- Add code comments
- Create tutorials
- Write guides

### 5. Testing
- Write unit tests
- Add integration tests
- Test on different devices
- Report compatibility issues

## 🚀 Getting Started

### 1. Fork the Repository
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/kid-quest-adventures.git
cd kid-quest-adventures
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Copy environment file
cp .env.example .env

# Edit .env with your database credentials
```

### 3. Create a Branch
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Or bug fix branch
git checkout -b fix/bug-description
```

## 📝 Coding Guidelines

### JavaScript/React Style

```javascript
// Use functional components
const MyComponent = () => {
  // Component logic
  return <div>Content</div>;
};

// Use descriptive names
const handleUserLogin = () => { /* ... */ };

// Add comments for complex logic
// Calculate total stars earned by user
const totalStars = progress.reduce((sum, p) => sum + p.stars, 0);

// Use async/await for promises
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Component Structure

```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Component definition
const MyComponent = () => {
  // 3. State and hooks
  const [data, setData] = useState(null);
  
  // 4. Effects
  useEffect(() => {
    fetchData();
  }, []);
  
  // 5. Functions
  const handleClick = () => {
    // Logic
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### CSS/Tailwind Guidelines

```javascript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 rounded-lg bg-blue-500">

// Use custom classes for repeated patterns
<button className="btn-primary">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Backend Guidelines

```javascript
// Use async/await
router.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM table');
    res.json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Validate inputs
const { body, validationResult } = require('express-validator');

router.post('/create', [
  body('name').notEmpty(),
  body('email').isEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});

// Use parameterized queries
const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

## 🎨 Adding New Features

### Adding a New Learning Topic

1. **Edit SubjectPage.jsx**
```javascript
const subjectData = {
  math: {
    topics: [
      // Add new topic
      {
        title: 'Multiplication',
        content: 'Learn to multiply numbers!',
        visual: '2 × 3 = 6',
        quiz: {
          question: 'What is 2 × 4?',
          options: ['6', '8', '10', '12'],
          correct: 1
        }
      }
    ]
  }
};
```

2. **Test the new topic**
3. **Submit pull request**

### Adding a New Game

1. **Create game component**
```javascript
// client/src/components/games/NewGame.jsx
const NewGame = () => {
  // Game logic
  return <div>Game UI</div>;
};
```

2. **Add to GamesPage.jsx**
```javascript
const games = [
  {
    id: 'new-game',
    title: 'New Game',
    emoji: '🎯',
    description: 'Description',
    color: 'from-blue-400 to-blue-600'
  }
];
```

3. **Implement game logic**
4. **Test thoroughly**
5. **Submit pull request**

### Adding a New Quiz Category

1. **Edit QuizzesPage.jsx**
```javascript
const quizzes = [
  {
    id: 'history',
    title: 'History Quiz',
    emoji: '📜',
    color: 'from-brown-400 to-brown-600',
    questions: [
      {
        question: 'Who was the first president?',
        options: ['A', 'B', 'C', 'D'],
        correct: 0
      }
    ]
  }
];
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Animations are smooth
- [ ] Data persists correctly
- [ ] Error handling works
- [ ] Accessible (keyboard navigation)

### Testing New Features

```bash
# Start development server
npm run dev

# Test in browser
# - Chrome DevTools
# - Responsive mode
# - Network tab
# - Console for errors
```

## 📤 Submitting Changes

### 1. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add multiplication topic to math module"

# Use conventional commits
# feat: New feature
# fix: Bug fix
# docs: Documentation
# style: Formatting
# refactor: Code restructuring
# test: Adding tests
# chore: Maintenance
```

### 2. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
How was this tested?

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on multiple devices
```

## 🐛 Reporting Bugs

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Device: [e.g., Desktop]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've thought of

## Additional Context
Mockups, examples, etc.
```

## 🎓 Learning Resources

### React & JavaScript
- [React Documentation](https://react.dev)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Modern JavaScript](https://javascript.info)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com)

### Framer Motion
- [Framer Motion Docs](https://www.framer.com/motion)
- [Animation Examples](https://www.framer.com/motion/examples)

### Node.js & Express
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com)
- [Neon Documentation](https://neon.tech/docs)

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

## 📞 Getting Help

### Questions?

- Open a GitHub Discussion
- Check existing issues
- Review documentation
- Ask in pull request comments

### Need Support?

- Create an issue with "question" label
- Provide context and details
- Be patient and respectful

## 🎉 Thank You!

Every contribution, no matter how small, helps make Kid Quest Adventures better for children around the world!

**Happy Contributing! 🚀**
