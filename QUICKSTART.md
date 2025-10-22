# ⚡ Quick Start Guide - Kid Quest Adventures

Get up and running in 5 minutes!

## 🚀 Super Fast Setup

### Step 1: Prerequisites (2 minutes)
```bash
# Check if Node.js is installed
node --version  # Should be v16 or higher

# If not installed, download from: https://nodejs.org/
```

### Step 2: Database Setup (2 minutes)
1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click "Create Project" → Name it "kid-quest"
3. Copy your connection string (starts with `postgresql://`)
4. In Neon SQL Editor, paste and run this:

```sql
-- Copy contents from server/config/init-db.sql and run it
```

### Step 3: Install & Configure (1 minute)
```bash
# Install all dependencies
npm install
cd client && npm install && cd ..

# Create .env file
cp .env.example .env

# Edit .env and add your database URL:
# DATABASE_URL=your_neon_connection_string_here
# JWT_SECRET=any_random_32_character_string_here
```

### Step 4: Run! (30 seconds)
```bash
# Start both servers
npm run dev

# Open browser to: http://localhost:5173
```

## 🎉 That's It!

You should now see the Kid Quest Adventures homepage!

---

## 🧪 Quick Test

1. Click "Start Your Adventure!"
2. Register as a Kid:
   - Name: Test Kid
   - Email: kid@test.com
   - Password: test123
   - Role: Kid
3. Explore the dashboard
4. Try a learning module
5. Play a game!

---

## 🐛 Quick Fixes

### "Cannot connect to database"
```bash
# Check your .env file
# Make sure DATABASE_URL is correct
# Verify Neon database is active
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

---

## 📚 Next Steps

- Read [README.md](README.md) for full documentation
- Check [FEATURES.md](FEATURES.md) for feature list
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide

---

## 🎯 Quick Commands

```bash
# Start development
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build
```

---

## 🌟 Quick Tips

1. **Test all roles**: Create Kid, Parent, and Teacher accounts
2. **Try everything**: Learning, games, quizzes, community
3. **Check the database**: Use Neon console to see data
4. **Customize**: Edit colors in `client/tailwind.config.js`
5. **Add content**: Modify topics in `client/src/pages/SubjectPage.jsx`

---

## 🚀 Deploy in 5 Minutes

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then deploy to production
vercel --prod
```

---

## 💡 Pro Tips

- Use Chrome DevTools for debugging
- Check browser console for errors
- Monitor Neon database in their console
- Test on mobile/tablet for responsive design
- Read code comments for understanding

---

## 🎮 Feature Checklist

Try these features:
- [ ] Register and login
- [ ] Complete a math lesson
- [ ] Play memory match game
- [ ] Take a quiz
- [ ] Create a community post
- [ ] Earn stars and badges
- [ ] Switch to parent account
- [ ] Approve a post
- [ ] View progress dashboard

---

## 📞 Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- Review [README.md](README.md) for full documentation
- Look at code comments
- Test each feature individually

---

## 🎉 Success!

If you can:
- ✅ See the homepage
- ✅ Register an account
- ✅ Login successfully
- ✅ Access the dashboard
- ✅ Complete a lesson

**You're all set! Happy learning! 🚀📚✨**

---

## 📊 What You Built

A complete educational platform with:
- 🎓 4 learning subjects
- 🎮 2 interactive games
- ✨ 3 quiz categories
- 👥 Safe community features
- 📊 3 role-based dashboards
- ⭐ Reward system
- 🎨 Beautiful animations

All in under 5 minutes! 🎉
