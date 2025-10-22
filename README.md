# 🎮 Kid Quest Adventures - Community Learning App for Kids

A fully functional, animated, kid-friendly web application where children (ages 5–12) can learn math, science, social values, and community awareness in a fun, interactive, and safe environment.

## 🌟 Features

### 🏠 Homepage
- Animated mascot and moving background elements
- Interactive navigation with smooth animations
- Welcoming interface designed for kids

### 📚 Learning Modules
- **Math**: Counting, addition, subtraction with drag-and-drop puzzles
- **Science**: Plants, animals, Earth, simple experiments
- **Social Studies**: Family, community helpers, respect for elders
- **Life Skills**: Good habits, traffic rules, cleanliness

Each module includes:
- Colorful visuals and Lottie animations
- Text-to-speech "Listen Mode"
- Interactive quizzes and mini-games
- Star and badge rewards system

### 🎮 Games & Quizzes
- Memory Match game
- Math Puzzle challenges
- Interactive quizzes with instant feedback
- Animated rewards and confetti celebrations

### 🧑‍🤝‍🧑 Community Section
- Safe "Kids Zone" for sharing stories and drawings
- Emoji-only reactions (no text comments)
- Parent/Teacher moderation system
- All posts reviewed before public display

### 🧭 Role-Based Dashboards

#### Kid Dashboard
- Progress tracking with stars and badges
- Avatar customization
- Quick access to learning modules, games, and community
- Motivational messages and achievements

#### Parent Dashboard
- Monitor children's learning progress
- View stars, badges, and completed activities
- Approve/reject community posts
- Track multiple children

#### Teacher Dashboard
- View all students' progress
- Class-wide statistics and analytics
- Moderate community content
- Assign lessons and track completion

### 🔐 Authentication
- Email-based login/signup system
- Role selection: Kid, Parent, Teacher
- JWT-based secure authentication
- Protected routes based on user roles

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lottie** - Advanced animations
- **Zustand** - State management
- **Axios** - API calls
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Neon PostgreSQL** - Cloud database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication
- **express-validator** - Input validation

### Hosting
- **Vercel** - Deployment platform

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd end2end
```

### 2. Install Dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
cd ..
```

### 3. Database Setup

1. Create a Neon PostgreSQL database at [neon.tech](https://neon.tech)
2. Copy your connection string
3. Run the database initialization script:

```bash
# Connect to your Neon database using psql or the Neon console
# Then run the SQL from: server/config/init-db.sql
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 5. Run the Application

#### Development Mode (Both servers)
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`

#### Or run separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### 6. Build for Production

```bash
npm run build
```

This creates an optimized production build in `client/dist/`

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `CLIENT_URL`

### Database Migration

The database schema is in `server/config/init-db.sql`. Run this SQL script in your Neon PostgreSQL console to create all necessary tables.

## 📁 Project Structure

```
end2end/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   │   ├── dashboards/    # Role-specific dashboards
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── LearningModules.jsx
│   │   │   ├── SubjectPage.jsx
│   │   │   ├── GamesPage.jsx
│   │   │   ├── QuizzesPage.jsx
│   │   │   └── CommunityPage.jsx
│   │   ├── store/             # State management
│   │   ├── utils/             # API client and utilities
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Backend Node.js application
│   ├── config/
│   │   ├── database.js        # Database connection
│   │   └── init-db.sql        # Database schema
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── progress.js        # Progress tracking routes
│   │   ├── activities.js      # Activity logging routes
│   │   └── community.js       # Community posts routes
│   └── index.js               # Server entry point
├── .env.example               # Environment variables template
├── .gitignore
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🎨 UI/UX Features

- **Bright Colors**: Kid-friendly color palette
- **Rounded Shapes**: Soft, approachable design
- **Large Fonts**: Easy to read for young children
- **Animations**: Framer Motion for smooth transitions
- **Voice Narration**: Text-to-speech for accessibility
- **Responsive Design**: Works on desktop and tablet
- **Confetti Celebrations**: Reward achievements visually

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- SQL injection prevention
- Content moderation system

## 📊 Database Schema

### Tables
- **users**: User accounts with roles
- **progress**: Learning progress tracking
- **badges**: Achievement badges
- **activities**: Activity logs
- **community_posts**: User-generated content
- **community_reactions**: Emoji reactions

See `server/config/init-db.sql` for complete schema.

## 🎯 User Roles

### Kid (Student)
- Access learning modules
- Play games and take quizzes
- Create community posts (requires approval)
- Earn stars and badges
- Track personal progress

### Parent
- Monitor children's progress
- View detailed statistics
- Approve/reject children's posts
- Multiple child accounts support

### Teacher
- View all students' progress
- Class-wide analytics
- Moderate all community content
- Track learning outcomes

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Progress
- `GET /api/progress` - Get user progress
- `POST /api/progress/update` - Update progress
- `GET /api/progress/children` - Get children progress (parent/teacher)

### Activities
- `GET /api/activities` - Get user activities
- `POST /api/activities/log` - Log new activity

### Community
- `GET /api/community/posts` - Get approved posts
- `GET /api/community/posts/pending` - Get pending posts (parent/teacher)
- `POST /api/community/posts` - Create post (kid)
- `PATCH /api/community/posts/:id/approve` - Approve post (parent/teacher)
- `DELETE /api/community/posts/:id` - Delete post
- `POST /api/community/posts/:id/react` - Add/remove reaction
- `GET /api/community/posts/:id/reactions` - Get post reactions

## 🐛 Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` in `.env`
- Ensure your Neon database is active
- Check SSL settings (should be `sslmode=require`)

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 🤝 Contributing

This is an educational project. Feel free to fork and customize for your needs!

## 📝 License

MIT License - Feel free to use this project for educational purposes.

## 🎉 Credits

Built with ❤️ for kids to learn and grow in a safe, fun environment!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Learning! 🚀📚✨**
