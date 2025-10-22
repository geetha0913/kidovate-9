const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Get approved posts
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT cp.*, u.name as author_name, u.avatar as author_avatar,
        (SELECT COUNT(*) FROM community_reactions WHERE post_id = cp.id) as reaction_count
      FROM community_posts cp
      JOIN users u ON cp.user_id = u.id
      WHERE cp.approved = TRUE
      ORDER BY cp.created_at DESC
      LIMIT 50
    `);

    res.json({ posts: result.rows });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// Get pending posts (for parents/teachers)
router.get('/posts/pending', authMiddleware, roleMiddleware('parent', 'teacher'), async (req, res) => {
  try {
    let query;
    let params = [];

    if (req.user.role === 'parent') {
      query = `
        SELECT cp.*, u.name as author_name, u.avatar as author_avatar
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.approved = FALSE AND u.parent_id = $1
        ORDER BY cp.created_at DESC
      `;
      params = [req.user.id];
    } else {
      query = `
        SELECT cp.*, u.name as author_name, u.avatar as author_avatar
        FROM community_posts cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.approved = FALSE
        ORDER BY cp.created_at DESC
      `;
    }

    const result = await pool.query(query, params);

    res.json({ posts: result.rows });
  } catch (error) {
    console.error('Get pending posts error:', error);
    res.status(500).json({ error: 'Failed to get pending posts' });
  }
});

// Create post
router.post('/posts', authMiddleware, roleMiddleware('kid'), async (req, res) => {
  try {
    const { postType, title, content, imageUrl } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'INSERT INTO community_posts (user_id, post_type, title, content, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, postType, title, content, imageUrl]
    );

    res.json({
      message: 'Post created! Waiting for approval.',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Approve post
router.patch('/posts/:id/approve', authMiddleware, roleMiddleware('parent', 'teacher'), async (req, res) => {
  try {
    const postId = req.params.id;
    const approverId = req.user.id;

    const result = await pool.query(
      'UPDATE community_posts SET approved = TRUE, approved_by = $1, approved_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [approverId, postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({
      message: 'Post approved!',
      post: result.rows[0]
    });
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({ error: 'Failed to approve post' });
  }
});

// Delete post
router.delete('/posts/:id', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    
    // Check if user owns the post or is parent/teacher
    const post = await pool.query('SELECT * FROM community_posts WHERE id = $1', [postId]);
    
    if (post.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.rows[0].user_id !== req.user.id && !['parent', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM community_posts WHERE id = $1', [postId]);

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Add reaction
router.post('/posts/:id/react', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;
    const { emoji } = req.body;
    const userId = req.user.id;

    // Check if reaction already exists
    const existing = await pool.query(
      'SELECT * FROM community_reactions WHERE post_id = $1 AND user_id = $2 AND emoji = $3',
      [postId, userId, emoji]
    );

    if (existing.rows.length > 0) {
      // Remove reaction
      await pool.query(
        'DELETE FROM community_reactions WHERE post_id = $1 AND user_id = $2 AND emoji = $3',
        [postId, userId, emoji]
      );
      res.json({ message: 'Reaction removed' });
    } else {
      // Add reaction
      await pool.query(
        'INSERT INTO community_reactions (post_id, user_id, emoji) VALUES ($1, $2, $3)',
        [postId, userId, emoji]
      );
      res.json({ message: 'Reaction added' });
    }
  } catch (error) {
    console.error('React error:', error);
    res.status(500).json({ error: 'Failed to react' });
  }
});

// Get reactions for a post
router.get('/posts/:id/reactions', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.id;

    const result = await pool.query(
      'SELECT emoji, COUNT(*) as count FROM community_reactions WHERE post_id = $1 GROUP BY emoji',
      [postId]
    );

    res.json({ reactions: result.rows });
  } catch (error) {
    console.error('Get reactions error:', error);
    res.status(500).json({ error: 'Failed to get reactions' });
  }
});

module.exports = router;
