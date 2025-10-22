# 🚀 Kid Quest Adventures - Quick Setup Guide

## Step-by-Step Setup Instructions

### Step 1: Install Node.js
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install version 16 or higher
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Create Neon Database

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Click "Create Project"
4. Name your project: "kid-quest-adventures"
5. Select your region
6. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Initialize Database

1. In Neon console, go to "SQL Editor"
2. Copy the contents of `server/config/init-db.sql`
3. Paste and run the SQL script
4. Verify tables are created (users, progress, badges, etc.)

### Step 4: Install Project Dependencies

```bash
# Navigate to project directory
cd end2end

# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### Step 5: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your details:
   ```env
   DATABASE_URL=your_neon_connection_string_here
   JWT_SECRET=create_a_random_secret_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

3. Generate a secure JWT secret:
   ```bash
   # On Linux/Mac
   openssl rand -base64 32
   
   # Or use any random string (at least 32 characters)
   ```

### Step 6: Run the Application

```bash
# Start both backend and frontend
npm run dev
```

This will start:
- Backend API: http://localhost:5000
- Frontend App: http://localhost:5173

### Step 7: Create Your First Account

1. Open browser to http://localhost:5173
2. Click "Start Your Adventure!"
3. Fill in registration form:
   - Name: Your name
   - Email: your@email.com
   - Password: At least 6 characters
   - Role: Choose Kid, Parent, or Teacher
4. Click "Create Account"
5. You'll be redirected to your dashboard!

## Testing the Application

### Test as a Kid
1. Register with role "Kid"
2. Explore learning modules
3. Play games and take quizzes
4. Create a community post
5. Earn stars and badges!

### Test as a Parent
1. Register with role "Parent"
2. View children's progress (need kids registered with your parent_id)
3. Approve/reject community posts
4. Monitor learning statistics

### Test as a Teacher
1. Register with role "Teacher"
2. View all students' progress
3. Moderate community content
4. Track class performance

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:**
- Check your `DATABASE_URL` in `.env`
- Ensure Neon database is active
- Verify SSL mode is set to `require`

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

### Issue: Frontend can't connect to backend
**Solution:**
- Ensure backend is running on port 5000
- Check CORS settings in `server/index.js`
- Verify `CLIENT_URL` in `.env`

## Production Deployment

### Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Set environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `CLIENT_URL` (your Vercel URL)

5. Redeploy after setting variables:
   ```bash
   vercel --prod
   ```

## Database Backup

To backup your Neon database:

1. Go to Neon console
2. Click on your project
3. Go to "Backups" section
4. Click "Create Backup"

Or use pg_dump:
```bash
pg_dump $DATABASE_URL > backup.sql
```

## Updating the Application

```bash
# Pull latest changes
git pull

# Update dependencies
npm install
cd client && npm install

# Restart servers
npm run dev
```

## Performance Tips

1. **Enable caching** for static assets
2. **Optimize images** before uploading
3. **Use production build** for deployment:
   ```bash
   npm run build
   ```
4. **Monitor database** queries in Neon console
5. **Set up CDN** for static files

## Security Checklist

- ✅ Change default JWT_SECRET
- ✅ Use strong passwords
- ✅ Enable SSL/HTTPS in production
- ✅ Keep dependencies updated
- ✅ Validate all user inputs
- ✅ Implement rate limiting (optional)
- ✅ Regular database backups

## Next Steps

1. Customize the color scheme in `client/tailwind.config.js`
2. Add more learning topics in `client/src/pages/SubjectPage.jsx`
3. Create additional games in `client/src/pages/GamesPage.jsx`
4. Add more quiz questions in `client/src/pages/QuizzesPage.jsx`
5. Implement file upload for community images
6. Add email notifications for parents
7. Create admin panel for system management

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments
- Test each feature individually
- Use browser DevTools for debugging

## Useful Commands

```bash
# Start development
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Build for production
npm run build

# Check for errors
npm run lint  # (if configured)

# View logs
# Backend logs appear in terminal
# Frontend logs in browser console
```

## Success Indicators

You'll know everything is working when:
- ✅ Both servers start without errors
- ✅ Frontend loads at http://localhost:5173
- ✅ You can register a new account
- ✅ Login works and redirects to dashboard
- ✅ Learning modules load with animations
- ✅ Games and quizzes are playable
- ✅ Community posts can be created
- ✅ Stars and badges are awarded

## Congratulations! 🎉

You've successfully set up Kid Quest Adventures! 

Now kids can start their learning journey in a fun, safe, and interactive environment!

---

**Happy Learning! 🚀📚✨**
