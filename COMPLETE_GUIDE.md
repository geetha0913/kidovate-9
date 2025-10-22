# 🎮 Kid Quest Adventures - Complete Guide & Documentation

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [System Requirements](#system-requirements)
5. [Installation on New System](#installation-on-new-system)
6. [Starting & Stopping the Application](#starting--stopping-the-application)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [API Documentation](#api-documentation)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🌟 Project Overview

**Kid Quest Adventures** is a full-stack web application designed for children (ages 5-12) to learn math, science, social values, and community awareness in a fun, interactive, and safe environment.

### Key Highlights:
- 🎨 Beautiful, kid-friendly UI with animations
- 🔐 Secure authentication with role-based access
- 👨‍👩‍👧 Parent-kid linking system for progress monitoring
- 📊 Real-time progress tracking with stars and badges
- 🎮 Interactive games and quizzes
- 🧑‍🤝‍🧑 Moderated community section
- 📱 Responsive design (desktop & tablet)

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React.js** | 18.x | UI framework for building interactive components |
| **Vite** | 5.x | Fast build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework for styling |
| **Framer Motion** | 11.x | Animation library for smooth transitions |
| **Lottie React** | 2.x | Advanced animations with JSON files |
| **Zustand** | 4.x | Lightweight state management |
| **Axios** | 1.x | HTTP client for API requests |
| **React Router** | 6.x | Client-side routing |
| **Lucide React** | Latest | Modern icon library |
| **React Confetti** | 6.x | Celebration animations |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime environment |
| **Express.js** | 4.x | Web application framework |
| **PostgreSQL** | Latest | Relational database (via Neon) |
| **Neon** | Cloud | Serverless PostgreSQL hosting |
| **bcryptjs** | 2.x | Password hashing and encryption |
| **jsonwebtoken** | 9.x | JWT-based authentication |
| **express-validator** | 7.x | Input validation and sanitization |
| **pg** | 8.x | PostgreSQL client for Node.js |
| **dotenv** | 16.x | Environment variable management |
| **cors** | 2.x | Cross-Origin Resource Sharing |
| **nodemon** | 3.x | Auto-restart server on file changes |
| **concurrently** | 8.x | Run multiple commands simultaneously |

### Development Tools

- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package manager

### Hosting & Deployment

- **Vercel** - Frontend and backend hosting
- **Neon** - PostgreSQL database hosting

---

## ✨ Features

### 1. **Authentication System**
- Email-based registration and login
- Role selection: Kid, Parent, Teacher
- JWT-based secure authentication
- Protected routes based on user roles
- Password hashing with bcrypt

### 2. **Learning Modules**
- **Math**: Counting, addition, subtraction, puzzles
- **Science**: Plants, animals, Earth, experiments
- **Social Studies**: Family, community, values
- **Life Skills**: Habits, traffic rules, cleanliness

Each module includes:
- Interactive lessons with animations
- Text-to-speech "Listen Mode"
- Quizzes and mini-games
- Star and badge rewards

### 3. **Games & Quizzes**
- Memory Match game
- Math Puzzle challenges
- Interactive quizzes with instant feedback
- Animated rewards and confetti celebrations

### 4. **Parent-Kid Linking System** ⭐ NEW!
- Kids can send link requests to parents
- Parents can send link requests to kids
- Two-way approval system for security
- Parents can view detailed kid progress:
  - Total stars, badges, completed lessons
  - Recent learning activities
  - Earned badges showcase
  - Activity timeline

### 5. **Community Section**
- Safe "Kids Zone" for sharing stories and drawings
- Emoji-only reactions (no text comments)
- Parent/Teacher moderation system
- All posts reviewed before public display

### 6. **Role-Based Dashboards**

#### Kid Dashboard
- Progress tracking with stars and badges
- Avatar customization
- Quick access to learning modules
- Link to parent account
- Motivational messages

#### Parent Dashboard
- View all linked kids
- Monitor each kid's detailed progress
- Approve/reject community posts
- Link to kid accounts
- Track multiple children

#### Teacher Dashboard
- View all students' progress
- Class-wide statistics
- Moderate community content
- Track learning outcomes

### 7. **Progress Tracking**
- Real-time star collection
- Badge achievements
- Activity logging
- Completion tracking
- Performance analytics

---

## 💻 System Requirements

### Minimum Requirements:
- **Operating System**: Windows 10/11, macOS 10.15+, or Linux
- **Node.js**: Version 16.x or higher
- **npm**: Version 8.x or higher (comes with Node.js)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Internet**: Required for database connection

### Browser Requirements:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📦 Installation on New System

### Step 1: Install Prerequisites

#### Install Node.js
1. Download from [nodejs.org](https://nodejs.org/)
2. Install LTS version (20.x recommended)
3. Verify installation:
```bash
node --version
npm --version
```

### Step 2: Extract the Project

If you have a ZIP file:
```bash
# Extract the ZIP file to your desired location
# Navigate to the project folder
cd path/to/end2end
```

### Step 3: Install Dependencies

#### Install Backend Dependencies
```bash
# In the root folder (end2end)
npm install
```

#### Install Frontend Dependencies
```bash
# Navigate to client folder
cd client
npm install
cd ..
```

**Note**: This may take 5-10 minutes depending on your internet speed.

### Step 4: Database Setup

#### Option A: Use Existing Neon Database

If you already have a Neon database:

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` file with your database credentials:
```env
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
JWT_SECRET=hlIe80oddDtl38UFr4Id5FGaJg5nHefPZp2CU/rjnb4=
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

#### Option B: Create New Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project: `kid-quest-db`
4. Copy the connection string
5. Go to **SQL Editor** in Neon dashboard
6. Copy the entire contents of `server/config/init-db.sql`
7. Paste and run in SQL Editor
8. Update your `.env` file with the connection string

### Step 5: Verify Installation

Check if all dependencies are installed:
```bash
# Check backend dependencies
npm list --depth=0

# Check frontend dependencies
cd client
npm list --depth=0
cd ..
```

---

## 🚀 Starting & Stopping the Application

### Starting the Application

#### Method 1: Start Both Servers Together (Recommended)

```bash
# From the root directory (end2end)
npm run dev
```

This will start:
- ✅ Backend server on `http://localhost:5000`
- ✅ Frontend dev server on `http://localhost:5173`

You'll see output like:
```
[0] 🚀 Server running on port 5000
[0] 🎮 Kid Quest Adventures API ready!
[0] ✅ Connected to Neon PostgreSQL database
[1] VITE v5.4.20  ready in 1069 ms
[1] ➜  Local:   http://localhost:5173/
```

#### Method 2: Start Servers Separately

**Start Backend Only:**
```bash
npm run server
```

**Start Frontend Only:**
```bash
npm run client
```

### Accessing the Application

Once started, open your browser and go to:
```
http://localhost:5173
```

### Stopping the Application

#### If using `npm run dev`:
- Press `Ctrl + C` in the terminal
- Type `Y` when asked "Terminate batch job (Y/N)?"

#### If servers are running separately:
- Press `Ctrl + C` in each terminal window

#### Force Stop (if needed):

**Windows:**
```bash
# Kill backend process
npx kill-port 5000

# Kill frontend process
npx kill-port 5173
```

**macOS/Linux:**
```bash
# Find and kill processes
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

### Restarting the Application

```bash
# Stop the application (Ctrl + C)
# Then start again
npm run dev
```

**Note**: The backend uses `nodemon`, so it auto-restarts when you save server files. The frontend uses Vite HMR (Hot Module Replacement), so changes appear instantly without restart.

---

## 📁 Project Structure

```
end2end/
│
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ParentKidLink.jsx   # Parent-kid linking modal
│   │   │   └── KidProgressView.jsx # Kid progress viewer
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── dashboards/         # Role-specific dashboards
│   │   │   │   ├── KidDashboard.jsx
│   │   │   │   ├── ParentDashboard.jsx
│   │   │   │   └── TeacherDashboard.jsx
│   │   │   ├── HomePage.jsx        # Landing page
│   │   │   ├── LoginPage.jsx       # Login page
│   │   │   ├── RegisterPage.jsx    # Registration page
│   │   │   ├── LearningModules.jsx # Learning modules list
│   │   │   ├── SubjectPage.jsx     # Individual subject page
│   │   │   ├── GamesPage.jsx       # Games page
│   │   │   ├── QuizzesPage.jsx     # Quizzes page
│   │   │   └── CommunityPage.jsx   # Community page
│   │   │
│   │   ├── store/                   # State management
│   │   │   └── authStore.js        # Zustand auth store
│   │   │
│   │   ├── utils/                   # Utilities
│   │   │   └── api.js              # Axios API client
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS config
│   └── postcss.config.js           # PostCSS config
│
├── server/                          # Backend Node.js Application
│   ├── config/
│   │   ├── database.js             # PostgreSQL connection
│   │   └── init-db.sql             # Database schema
│   │
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication middleware
│   │
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── progress.js             # Progress tracking routes
│   │   ├── activities.js           # Activity logging routes
│   │   ├── community.js            # Community posts routes
│   │   └── parentKid.js            # Parent-kid linking routes ⭐ NEW
│   │
│   └── index.js                    # Server entry point
│
├── .env                             # Environment variables (DO NOT COMMIT)
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── package.json                     # Root package.json
├── package-lock.json               # Dependency lock file
│
├── README.md                        # Main documentation
├── COMPLETE_GUIDE.md               # This file
├── SETUP_GUIDE.md                  # Setup instructions
├── QUICKSTART.md                   # Quick start guide
├── FEATURES.md                     # Feature documentation
├── PARENT_KID_LINKING.md          # Parent-kid linking guide
├── UPDATE_INSTRUCTIONS.md         # Update guide
├── DEPLOYMENT.md                   # Deployment guide
├── CONTRIBUTING.md                 # Contribution guidelines
└── PROJECT_SUMMARY.md             # Project summary
```

---

## 🗄️ Database Schema

### Tables

#### 1. **users**
Stores all user accounts (kids, parents, teachers)

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique user ID |
| name | VARCHAR(255) | User's full name |
| email | VARCHAR(255) UNIQUE | Email address |
| password_hash | VARCHAR(255) | Hashed password |
| role | VARCHAR(20) | 'kid', 'parent', or 'teacher' |
| parent_id | INTEGER | Reference to parent user |
| avatar | VARCHAR(50) | Avatar selection |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

#### 2. **progress**
Tracks learning progress for each user

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique progress ID |
| user_id | INTEGER | Reference to user |
| subject | VARCHAR(50) | Subject name |
| topic | VARCHAR(100) | Topic name |
| score | INTEGER | Score achieved |
| stars | INTEGER | Stars earned |
| completed | BOOLEAN | Completion status |
| completed_at | TIMESTAMP | Completion time |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

#### 3. **badges**
Stores earned badges

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique badge ID |
| user_id | INTEGER | Reference to user |
| badge_name | VARCHAR(100) | Badge name |
| badge_type | VARCHAR(50) | Badge category |
| earned_at | TIMESTAMP | When badge was earned |

#### 4. **activities**
Logs all user activities

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique activity ID |
| user_id | INTEGER | Reference to user |
| activity_type | VARCHAR(50) | Type of activity |
| activity_name | VARCHAR(255) | Activity name |
| details | JSONB | Additional details |
| timestamp | TIMESTAMP | When activity occurred |

#### 5. **community_posts**
Stores community posts from kids

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique post ID |
| user_id | INTEGER | Reference to user |
| post_type | VARCHAR(20) | 'drawing', 'story', 'photo' |
| title | VARCHAR(255) | Post title |
| content | TEXT | Post content |
| image_url | VARCHAR(500) | Image URL |
| approved | BOOLEAN | Approval status |
| approved_by | INTEGER | Who approved it |
| approved_at | TIMESTAMP | Approval time |
| created_at | TIMESTAMP | Post creation time |

#### 6. **community_reactions**
Stores emoji reactions to posts

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique reaction ID |
| post_id | INTEGER | Reference to post |
| user_id | INTEGER | Reference to user |
| emoji | VARCHAR(10) | Emoji character |
| created_at | TIMESTAMP | Reaction time |

#### 7. **parent_kid_requests** ⭐ NEW
Manages parent-kid linking requests

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PRIMARY KEY | Unique request ID |
| kid_id | INTEGER | Reference to kid user |
| parent_id | INTEGER | Reference to parent user |
| status | VARCHAR(20) | 'pending', 'approved', 'rejected' |
| requested_by | VARCHAR(20) | 'kid' or 'parent' |
| created_at | TIMESTAMP | Request creation time |
| updated_at | TIMESTAMP | Last update time |

### Database Indexes

For optimal performance, the following indexes are created:

```sql
idx_users_email              -- Fast email lookups
idx_users_role               -- Filter by role
idx_users_parent_id          -- Find kids by parent
idx_progress_user_id         -- User progress queries
idx_activities_user_id       -- User activity queries
idx_community_posts_user_id  -- User posts queries
idx_community_posts_approved -- Filter approved posts
idx_parent_kid_requests_kid  -- Find requests by kid
idx_parent_kid_requests_parent -- Find requests by parent
idx_parent_kid_requests_status -- Filter by status
```

---

## 🔌 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.vercel.app/api
```

### Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "kid",
  "avatar": "robot1"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "kid",
    "avatar": "robot1"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

---

### Progress Endpoints

#### Get User Progress
```http
GET /api/progress?userId=1
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "progress": [...],
  "badges": [...],
  "stats": {
    "totalStars": 150,
    "totalBadges": 5,
    "completedLessons": 12
  }
}
```

#### Update Progress
```http
POST /api/progress/update
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "subject": "Math",
  "topic": "Addition",
  "score": 90,
  "stars": 3,
  "completed": true
}
```

---

### Parent-Kid Linking Endpoints ⭐ NEW

#### Send Link Request
```http
POST /api/parent-kid/request
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "targetEmail": "parent@example.com",
  "requestedBy": "kid"
}
```

#### Get Pending Requests
```http
GET /api/parent-kid/requests
Headers: Authorization: Bearer <token>
```

#### Approve/Reject Request
```http
POST /api/parent-kid/respond/:requestId
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "action": "approve"  // or "reject"
}
```

#### Get Linked Kids (Parents Only)
```http
GET /api/parent-kid/my-kids
Headers: Authorization: Bearer <token>
```

#### Get Kid's Progress (Parents Only)
```http
GET /api/parent-kid/kid-progress/:kidId
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "progress": [...],
  "badges": [...],
  "activities": [...],
  "stats": {
    "totalStars": 150,
    "completedLessons": 12,
    "totalBadges": 5
  }
}
```

---

### Community Endpoints

#### Get Approved Posts
```http
GET /api/community/posts
```

#### Create Post (Kids Only)
```http
POST /api/community/posts
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "post_type": "story",
  "title": "My Adventure",
  "content": "Once upon a time..."
}
```

#### Approve Post (Parent/Teacher)
```http
PATCH /api/community/posts/:id/approve
Headers: Authorization: Bearer <token>
```

#### React to Post
```http
POST /api/community/posts/:id/react
Headers: Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "emoji": "👍"
}
```

---

## 🌐 Deployment Guide

### Deploy to Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# From project root
vercel
```

#### 4. Set Environment Variables

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
   - `DATABASE_URL` = Your Neon connection string
   - `JWT_SECRET` = Your secret key
   - `CLIENT_URL` = Your Vercel frontend URL
   - `NODE_ENV` = production

#### 5. Deploy Production
```bash
vercel --prod
```

### Database Migration

Before deploying, ensure your Neon database has all tables:

1. Go to Neon Dashboard → SQL Editor
2. Run the entire `server/config/init-db.sql` script
3. Verify all tables are created

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Cannot find module" Error

**Problem**: Missing dependencies

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

#### 2. "Port already in use" Error

**Problem**: Port 5000 or 5173 is occupied

**Solution**:
```bash
# Windows
npx kill-port 5000
npx kill-port 5173

# macOS/Linux
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

#### 3. Database Connection Error

**Problem**: Cannot connect to Neon database

**Solutions**:
- Check your `DATABASE_URL` in `.env`
- Ensure database is active in Neon dashboard
- Verify SSL mode: `?sslmode=require`
- Check internet connection

#### 4. "Invalid or expired token" Error

**Problem**: Authentication token issues

**Solutions**:
- Clear browser localStorage
- Logout and login again
- Check if `JWT_SECRET` matches in `.env`
- Verify token is being sent in headers

#### 5. Frontend Not Loading

**Problem**: Blank page or errors

**Solutions**:
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run dev
```

#### 6. Database Tables Don't Exist

**Problem**: "relation does not exist" errors

**Solution**:
- Go to Neon SQL Editor
- Run `server/config/init-db.sql`
- Restart server

#### 7. CORS Errors

**Problem**: Cross-origin request blocked

**Solution**:
- Check `CLIENT_URL` in `.env`
- Ensure it matches your frontend URL
- Restart backend server

---

## 📚 Additional Resources

### Documentation Files

- **README.md** - Main project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICKSTART.md** - Quick start guide
- **FEATURES.md** - Complete feature list
- **PARENT_KID_LINKING.md** - Parent-kid linking guide
- **UPDATE_INSTRUCTIONS.md** - How to update the app
- **DEPLOYMENT.md** - Deployment instructions
- **CONTRIBUTING.md** - Contribution guidelines

### Useful Commands

```bash
# Development
npm run dev              # Start both servers
npm run server          # Start backend only
npm run client          # Start frontend only

# Production
npm run build           # Build frontend for production
npm start               # Start production server

# Maintenance
npm install             # Install dependencies
npm update              # Update dependencies
npm audit fix           # Fix security vulnerabilities

# Database
# Run init-db.sql in Neon SQL Editor

# Deployment
vercel                  # Deploy to Vercel
vercel --prod          # Deploy to production
```

### Environment Variables Reference

```env
# Required
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your_secret_key_here

# Optional
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🎯 Quick Reference

### Default Ports
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

### User Roles
- **kid** - Student account
- **parent** - Parent account
- **teacher** - Teacher account

### Avatar Options
- robot1, robot2, unicorn, dragon
- cat, dog, lion, panda

### Post Types
- drawing, story, photo

### Request Status
- pending, approved, rejected

---

## 🎉 Success Checklist

After installation, verify:

- [ ] Node.js and npm are installed
- [ ] All dependencies are installed (root + client)
- [ ] `.env` file is configured with database URL
- [ ] Database tables are created in Neon
- [ ] Backend starts without errors (port 5000)
- [ ] Frontend starts without errors (port 5173)
- [ ] Can register a new user
- [ ] Can login successfully
- [ ] Dashboard loads correctly
- [ ] Can navigate between pages
- [ ] Parent-kid linking works

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review troubleshooting section
3. Check browser console for errors
4. Check server terminal for errors
5. Verify `.env` configuration
6. Ensure database is active

---

## 🎓 Learning Resources

### React
- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)

### Node.js & Express
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresql.org/docs)
- [Neon Documentation](https://neon.tech/docs)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)

---

## 📝 License

MIT License - Free to use for educational purposes.

---

## 🙏 Credits

Built with ❤️ for kids to learn and grow in a safe, fun environment!

**Technologies Used:**
- React.js, Vite, Tailwind CSS, Framer Motion
- Node.js, Express.js, PostgreSQL, Neon
- JWT, bcrypt, Zustand, Axios

---

**Happy Learning! 🚀📚✨**

*Last Updated: October 2025*
