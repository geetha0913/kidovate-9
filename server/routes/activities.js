const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Get user activities
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    const limit = parseInt(req.query.limit) || 50;

    const result = await pool.query(
      'SELECT * FROM activities WHERE user_id = $1 ORDER BY timestamp DESC LIMIT $2',
      [userId, limit]
    );

    res.json({ activities: result.rows });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

// Log activity
router.post('/log', authMiddleware, async (req, res) => {
  try {
    const { activityType, activityName, details } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO activities (user_id, activity_type, activity_name, details) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, activityType, activityName, JSON.stringify(details || {})]
    );

    res.json({
      message: 'Activity logged',
      activity: result.rows[0]
    });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

module.exports = router;
