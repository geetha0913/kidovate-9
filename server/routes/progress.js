const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get user progress
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    
    // Check if user has permission to view this progress
    if (req.user.role === 'kid' && userId != req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const badges = await pool.query(
      'SELECT * FROM badges WHERE user_id = $1 ORDER BY earned_at DESC',
      [userId]
    );

    // Calculate total stats
    const totalStars = result.rows.reduce((sum, p) => sum + p.stars, 0);
    const completedTopics = result.rows.filter(p => p.completed).length;

    res.json({
      progress: result.rows,
      badges: badges.rows,
      stats: {
        totalStars,
        completedTopics,
        totalBadges: badges.rows.length
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Update progress
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { subject, topic, score, stars } = req.body;
    const userId = req.user.id;

    // Check if progress exists
    const existing = await pool.query(
      'SELECT * FROM progress WHERE user_id = $1 AND subject = $2 AND topic = $3',
      [userId, subject, topic]
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing progress
      result = await pool.query(
        'UPDATE progress SET score = GREATEST(score, $1), stars = stars + $2, completed = TRUE, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id = $3 AND subject = $4 AND topic = $5 RETURNING *',
        [score, stars, userId, subject, topic]
      );
    } else {
      // Create new progress
      result = await pool.query(
        'INSERT INTO progress (user_id, subject, topic, score, stars, completed, completed_at) VALUES ($1, $2, $3, $4, $5, TRUE, CURRENT_TIMESTAMP) RETURNING *',
        [userId, subject, topic, score, stars]
      );
    }

    // Check for badge eligibility
    await checkAndAwardBadges(userId, subject);

    res.json({
      message: 'Progress updated!',
      progress: result.rows[0]
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Award badge
async function checkAndAwardBadges(userId, subject) {
  try {
    const progress = await pool.query(
      'SELECT COUNT(*) as count FROM progress WHERE user_id = $1 AND subject = $2 AND completed = TRUE',
      [userId, subject]
    );

    const count = parseInt(progress.rows[0].count);
    let badgeName = null;

    if (count === 5) {
      badgeName = `${subject} Beginner`;
    } else if (count === 10) {
      badgeName = `${subject} Expert`;
    } else if (count === 20) {
      badgeName = `${subject} Master`;
    }

    if (badgeName) {
      // Check if badge already exists
      const existing = await pool.query(
        'SELECT * FROM badges WHERE user_id = $1 AND badge_name = $2',
        [userId, badgeName]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          'INSERT INTO badges (user_id, badge_name, badge_type) VALUES ($1, $2, $3)',
          [userId, badgeName, subject]
        );
      }
    }
  } catch (error) {
    console.error('Badge check error:', error);
  }
}

// Get children progress (for parents)
router.get('/children', authMiddleware, roleMiddleware('parent', 'teacher'), async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.role === 'parent') {
      query = `
        SELECT u.id, u.name, u.email, u.avatar,
          COUNT(DISTINCT p.id) as total_activities,
          SUM(p.stars) as total_stars,
          COUNT(DISTINCT b.id) as total_badges
        FROM users u
        LEFT JOIN progress p ON u.id = p.user_id
        LEFT JOIN badges b ON u.id = b.user_id
        WHERE u.parent_id = $1 AND u.role = 'kid'
        GROUP BY u.id, u.name, u.email, u.avatar
      `;
      params = [req.user.id];
    } else {
      // Teacher can see all kids
      query = `
        SELECT u.id, u.name, u.email, u.avatar,
          COUNT(DISTINCT p.id) as total_activities,
          SUM(p.stars) as total_stars,
          COUNT(DISTINCT b.id) as total_badges
        FROM users u
        LEFT JOIN progress p ON u.id = p.user_id
        LEFT JOIN badges b ON u.id = b.user_id
        WHERE u.role = 'kid'
        GROUP BY u.id, u.name, u.email, u.avatar
      `;
      params = [];
    }

    const result = await pool.query(query, params);

    res.json({ children: result.rows });
  } catch (error) {
    console.error('Get children progress error:', error);
    res.status(500).json({ error: 'Failed to get children progress' });
  }
});

module.exports = router;
