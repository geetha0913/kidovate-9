# 🚀 Deployment Guide - Kid Quest Adventures

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for this full-stack application.

#### Prerequisites
- Vercel account (free tier available)
- Neon PostgreSQL database
- GitHub repository (optional but recommended)

#### Step 1: Prepare Your Application

1. Ensure all environment variables are set in `.env`
2. Test locally to confirm everything works:
   ```bash
   npm run dev
   ```
3. Build the frontend to test production build:
   ```bash
   cd client
   npm run build
   ```

#### Step 2: Deploy to Vercel

**Method A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? kid-quest-adventures
# - Directory? ./
# - Override settings? No

# After deployment, set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add CLIENT_URL

# Deploy to production
vercel --prod
```

**Method B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository (or upload files)
4. Configure project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
5. Add Environment Variables:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
   - `CLIENT_URL`: Your Vercel deployment URL
6. Click "Deploy"

#### Step 3: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` environment variable

#### Step 4: Verify Deployment

1. Visit your Vercel URL
2. Test registration and login
3. Check all features work
4. Monitor logs in Vercel dashboard

---

### Option 2: Railway

Railway is another excellent option for full-stack apps.

#### Step 1: Setup Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to existing project or create new
railway link
```

#### Step 2: Deploy

```bash
# Deploy application
railway up

# Add environment variables
railway variables set DATABASE_URL=your_neon_url
railway variables set JWT_SECRET=your_secret
railway variables set CLIENT_URL=your_railway_url
```

#### Step 3: Configure Services

1. Create two services:
   - Backend (Node.js)
   - Frontend (Static)
2. Set build commands:
   - Backend: `npm install`
   - Frontend: `cd client && npm install && npm run build`

---

### Option 3: Heroku

#### Step 1: Prepare Heroku

```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create kid-quest-adventures
```

#### Step 2: Configure Buildpacks

```bash
# Add Node.js buildpack
heroku buildpacks:add heroku/nodejs

# Add static buildpack for frontend
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static
```

#### Step 3: Set Environment Variables

```bash
heroku config:set DATABASE_URL=your_neon_url
heroku config:set JWT_SECRET=your_secret
heroku config:set NODE_ENV=production
heroku config:set CLIENT_URL=https://your-app.herokuapp.com
```

#### Step 4: Deploy

```bash
# Add Heroku remote
git remote add heroku https://git.heroku.com/kid-quest-adventures.git

# Deploy
git push heroku main

# Open app
heroku open
```

---

### Option 4: DigitalOcean App Platform

#### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Click "Create App"
3. Connect your GitHub repository
4. Select branch (main/master)

#### Step 2: Configure Components

**Backend Component:**
- Type: Web Service
- Run Command: `npm start`
- Build Command: `npm install`
- HTTP Port: 5000

**Frontend Component:**
- Type: Static Site
- Build Command: `cd client && npm install && npm run build`
- Output Directory: `client/dist`

#### Step 3: Environment Variables

Add in App Settings:
- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- `CLIENT_URL`

#### Step 4: Deploy

Click "Create Resources" and wait for deployment.

---

## Database Setup (Neon PostgreSQL)

### Production Database Configuration

1. **Create Production Database**
   ```
   - Go to Neon console
   - Create new project or use existing
   - Copy connection string
   ```

2. **Run Database Migrations**
   ```bash
   # Connect to Neon database
   psql "your_neon_connection_string"
   
   # Run init script
   \i server/config/init-db.sql
   ```

3. **Verify Tables**
   ```sql
   \dt  -- List all tables
   ```

4. **Set up Backups**
   - Enable automatic backups in Neon console
   - Set backup schedule (daily recommended)

---

## Environment Variables Checklist

Ensure these are set in your deployment platform:

- ✅ `DATABASE_URL` - Neon PostgreSQL connection string
- ✅ `JWT_SECRET` - Random secret key (32+ characters)
- ✅ `NODE_ENV` - Set to "production"
- ✅ `PORT` - Usually auto-set by platform
- ✅ `CLIENT_URL` - Your frontend URL

---

## Post-Deployment Checklist

### Testing

- [ ] Homepage loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Kid dashboard displays
- [ ] Parent dashboard displays
- [ ] Teacher dashboard displays
- [ ] Learning modules load
- [ ] Games are playable
- [ ] Quizzes work
- [ ] Community posts can be created
- [ ] Post moderation works
- [ ] Stars and badges are awarded
- [ ] Logout works

### Performance

- [ ] Page load time < 3 seconds
- [ ] Images are optimized
- [ ] API responses < 500ms
- [ ] Database queries are indexed
- [ ] Caching is enabled

### Security

- [ ] HTTPS is enabled
- [ ] Environment variables are secure
- [ ] CORS is properly configured
- [ ] SQL injection prevention works
- [ ] XSS protection is active
- [ ] Rate limiting (if implemented)

### Monitoring

- [ ] Error logging is set up
- [ ] Performance monitoring enabled
- [ ] Database monitoring active
- [ ] Uptime monitoring configured

---

## Continuous Deployment

### GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm install
    - cd client && npm install && npm run build

deploy:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
  only:
    - main
```

---

## Scaling Considerations

### Database Scaling

1. **Connection Pooling**
   ```javascript
   // In server/config/database.js
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20, // Maximum connections
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

2. **Read Replicas**
   - Set up read replicas in Neon
   - Route read queries to replicas
   - Keep writes on primary

3. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data
   - Set appropriate TTL values

### Application Scaling

1. **Horizontal Scaling**
   - Deploy multiple instances
   - Use load balancer
   - Session management with Redis

2. **CDN Integration**
   - Serve static assets via CDN
   - Reduce server load
   - Improve global performance

3. **Code Optimization**
   - Lazy load components
   - Optimize bundle size
   - Minimize API calls

---

## Monitoring & Maintenance

### Monitoring Tools

1. **Vercel Analytics**
   - Built-in performance monitoring
   - Real-time metrics
   - Error tracking

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/node @sentry/react
   ```

3. **LogRocket** (Session Replay)
   ```bash
   npm install logrocket
   ```

### Maintenance Tasks

**Daily:**
- Check error logs
- Monitor performance metrics
- Review user feedback

**Weekly:**
- Database backup verification
- Security updates
- Performance optimization

**Monthly:**
- Dependency updates
- Security audit
- Cost optimization review

---

## Rollback Procedure

If deployment fails:

### Vercel Rollback

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push -f origin main
```

---

## Support & Troubleshooting

### Common Issues

**Issue: Database connection fails**
- Check DATABASE_URL format
- Verify Neon database is active
- Check SSL settings

**Issue: 404 on refresh**
- Configure routing in vercel.json
- Set up proper redirects

**Issue: Environment variables not working**
- Redeploy after setting variables
- Check variable names (case-sensitive)
- Verify in deployment logs

### Getting Help

- Check deployment logs
- Review Vercel/platform documentation
- Test locally first
- Use browser DevTools

---

## Cost Optimization

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless function invocations

**Neon:**
- 3 projects free
- 10GB storage
- Reasonable compute

### Tips to Stay Free

1. Optimize images
2. Minimize API calls
3. Use caching effectively
4. Monitor usage regularly

---

## Success Metrics

Track these after deployment:

- **User Registrations**: Daily/weekly signups
- **Active Users**: Daily/monthly active users
- **Engagement**: Time spent on platform
- **Completion Rates**: Lessons completed
- **Error Rate**: < 1% target
- **Response Time**: < 500ms average
- **Uptime**: > 99.9% target

---

## 🎉 Congratulations!

Your Kid Quest Adventures app is now live and ready for kids to learn and play!

**Next Steps:**
1. Share the URL with users
2. Monitor initial usage
3. Gather feedback
4. Iterate and improve

**Happy Deploying! 🚀**
