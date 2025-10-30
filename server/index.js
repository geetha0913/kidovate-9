const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://kidovate-frontend-ufbq.vercel.app",
  "https://kidovate-frontend-ufbq-git-main-sgeethas-projects.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc.
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);





app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Root route
app.get('/', (req, res) => {
  res.send('🎮 Kid Quest Adventures API is running! Visit /api/health to check DB status.');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/community', require('./routes/community'));
app.use('/api/parent-kid', require('./routes/parentKid'));

// Health check (reports DB connectivity)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'OK', db: 'connected' });
  } catch (err) {
    return res.status(503).json({ status: 'DEGRADED', db: 'disconnected', error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!', 
    message: err.message 
  });
});

const pool = require('./config/database');

const PORT = process.env.PORT || 5000;

// Start server only after successful DB connection
async function startServer() {
  const maxAttempts = parseInt(process.env.DB_STARTUP_RETRY_ATTEMPTS || '5', 10);
  const delayMs = parseInt(process.env.DB_STARTUP_RETRY_DELAY_MS || '2000', 10);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await pool.query('SELECT 1');
      console.log(`✅ Database connection verified (attempt ${attempt})`);

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🎮 Kid Quest Adventures API ready!`);
      });
      return;
    } catch (err) {
      console.error(`DB connect attempt ${attempt} failed:`, err.message || err);
      if (attempt < maxAttempts) {
        const wait = delayMs * attempt; // simple backoff
        console.log(`Waiting ${wait}ms before retrying...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        console.error('❌ Exhausted DB connection attempts. Server will not start.');
        process.exit(1);
      }
    }
  }
}

startServer();
