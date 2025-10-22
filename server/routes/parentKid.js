const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Send link request (from kid or parent)
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { targetEmail, requestedBy } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Validate requested_by matches user role
    if (requestedBy !== userRole) {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    // Find target user
    const targetResult = await pool.query(
      'SELECT id, role FROM users WHERE email = $1',
      [targetEmail]
    );

    if (targetResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found with this email' });
    }

    const targetUser = targetResult.rows[0];

    // Validate roles
    if (requestedBy === 'kid' && targetUser.role !== 'parent') {
      return res.status(400).json({ error: 'Target user must be a parent' });
    }
    if (requestedBy === 'parent' && targetUser.role !== 'kid') {
      return res.status(400).json({ error: 'Target user must be a kid' });
    }

    const kidId = requestedBy === 'kid' ? userId : targetUser.id;
    const parentId = requestedBy === 'parent' ? userId : targetUser.id;

    // Check if request already exists
    const existingRequest = await pool.query(
      'SELECT * FROM parent_kid_requests WHERE kid_id = $1 AND parent_id = $2',
      [kidId, parentId]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(400).json({ error: 'Link request already exists' });
    }

    // Check if already linked
    const linkedCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND parent_id = $2',
      [kidId, parentId]
    );

    if (linkedCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Already linked to this parent' });
    }

    // Create request
    const result = await pool.query(
      `INSERT INTO parent_kid_requests (kid_id, parent_id, requested_by, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [kidId, parentId, requestedBy]
    );

    res.json({
      message: 'Link request sent successfully',
      request: result.rows[0]
    });
  } catch (error) {
    console.error('Link request error:', error);
    res.status(500).json({ error: 'Failed to send link request' });
  }
});

// Get pending requests (for current user)
router.get('/requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query;
    if (userRole === 'kid') {
      query = `
        SELECT pkr.*, u.name as parent_name, u.email as parent_email
        FROM parent_kid_requests pkr
        JOIN users u ON pkr.parent_id = u.id
        WHERE pkr.kid_id = $1 AND pkr.status = 'pending'
        ORDER BY pkr.created_at DESC
      `;
    } else if (userRole === 'parent') {
      query = `
        SELECT pkr.*, u.name as kid_name, u.email as kid_email
        FROM parent_kid_requests pkr
        JOIN users u ON pkr.kid_id = u.id
        WHERE pkr.parent_id = $1 AND pkr.status = 'pending'
        ORDER BY pkr.created_at DESC
      `;
    } else {
      return res.json({ requests: [] });
    }

    const result = await pool.query(query, [userId]);
    res.json({ requests: result.rows });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Approve/Reject request
router.post('/respond/:requestId', authMiddleware, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // 'approve' or 'reject'
    const userId = req.user.id;

    // Get request details
    const requestResult = await pool.query(
      'SELECT * FROM parent_kid_requests WHERE id = $1',
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const request = requestResult.rows[0];

    // Verify user is the recipient of the request
    if (request.requested_by === 'kid' && request.parent_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }
    if (request.requested_by === 'parent' && request.kid_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to respond to this request' });
    }

    if (action === 'approve') {
      // Update user's parent_id
      await pool.query(
        'UPDATE users SET parent_id = $1 WHERE id = $2',
        [request.parent_id, request.kid_id]
      );

      // Update request status
      await pool.query(
        `UPDATE parent_kid_requests 
         SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [requestId]
      );

      res.json({ message: 'Link request approved successfully' });
    } else if (action === 'reject') {
      // Update request status
      await pool.query(
        `UPDATE parent_kid_requests 
         SET status = 'rejected', updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [requestId]
      );

      res.json({ message: 'Link request rejected' });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Respond to request error:', error);
    res.status(500).json({ error: 'Failed to respond to request' });
  }
});

// Get linked kids (for parents)
router.get('/my-kids', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can access this' });
    }

    const result = await pool.query(
      `SELECT id, name, email, avatar, created_at 
       FROM users 
       WHERE parent_id = $1 AND role = 'kid'
       ORDER BY name`,
      [userId]
    );

    res.json({ kids: result.rows });
  } catch (error) {
    console.error('Get kids error:', error);
    res.status(500).json({ error: 'Failed to fetch kids' });
  }
});

// Get kid's progress (for parents)
router.get('/kid-progress/:kidId', authMiddleware, async (req, res) => {
  try {
    const { kidId } = req.params;
    const parentId = req.user.id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can access this' });
    }

    // Verify kid is linked to this parent
    const linkCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND parent_id = $2',
      [kidId, parentId]
    );

    if (linkCheck.rows.length === 0) {
      return res.status(403).json({ error: 'This kid is not linked to your account' });
    }

    // Get kid's progress
    const progressResult = await pool.query(
      `SELECT subject, topic, score, stars, completed, completed_at
       FROM progress
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [kidId]
    );

    // Get kid's badges
    const badgesResult = await pool.query(
      `SELECT badge_name, badge_type, earned_at
       FROM badges
       WHERE user_id = $1
       ORDER BY earned_at DESC`,
      [kidId]
    );

    // Get kid's recent activities
    const activitiesResult = await pool.query(
      `SELECT activity_type, activity_name, details, timestamp
       FROM activities
       WHERE user_id = $1
       ORDER BY timestamp DESC
       LIMIT 20`,
      [kidId]
    );

    // Calculate stats
    const totalStars = progressResult.rows.reduce((sum, p) => sum + (p.stars || 0), 0);
    const completedLessons = progressResult.rows.filter(p => p.completed).length;

    res.json({
      progress: progressResult.rows,
      badges: badgesResult.rows,
      activities: activitiesResult.rows,
      stats: {
        totalStars,
        completedLessons,
        totalBadges: badgesResult.rows.length
      }
    });
  } catch (error) {
    console.error('Get kid progress error:', error);
    res.status(500).json({ error: 'Failed to fetch kid progress' });
  }
});

// Unlink kid from parent
router.post('/unlink/:kidId', authMiddleware, async (req, res) => {
  try {
    const { kidId } = req.params;
    const parentId = req.user.id;

    if (req.user.role !== 'parent') {
      return res.status(403).json({ error: 'Only parents can unlink kids' });
    }

    // Verify kid is linked to this parent
    const linkCheck = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND parent_id = $2',
      [kidId, parentId]
    );

    if (linkCheck.rows.length === 0) {
      return res.status(403).json({ error: 'This kid is not linked to your account' });
    }

    // Unlink
    await pool.query(
      'UPDATE users SET parent_id = NULL WHERE id = $1',
      [kidId]
    );

    res.json({ message: 'Kid unlinked successfully' });
  } catch (error) {
    console.error('Unlink error:', error);
    res.status(500).json({ error: 'Failed to unlink kid' });
  }
});

module.exports = router;
