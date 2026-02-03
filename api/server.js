const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3500;

// PostgreSQL connection
const pool = new Pool({
  host: 'localhost',
  database: 'rohan-profile',
  user: 'rohanprofile',
  password: 'rohan123',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// Serve static files from build directory
app.use(express.static(path.join(__dirname, '../build')));

// ============== API Routes ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get visitor count
app.get('/api/portfolio/visitors', async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT stat_value FROM portfolio_stats WHERE stat_key = 'total_visitors'"
    );
    const count = result.rows[0]?.stat_value || 0;
    res.json({ count });
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment visitor count
app.post('/api/portfolio/visitors', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE portfolio_stats 
       SET stat_value = stat_value + 1, updated_at = NOW() 
       WHERE stat_key = 'total_visitors' 
       RETURNING stat_value`
    );
    const count = result.rows[0]?.stat_value || 0;
    res.json({ count });
  } catch (error) {
    console.error('Visitor increment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get view count for a post
app.get('/api/portfolio/blog/:postId/views', async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      'SELECT view_count FROM blog_views WHERE post_id = $1',
      [postId]
    );
    const count = result.rows[0]?.view_count || 0;
    res.json({ postId, count });
  } catch (error) {
    console.error('Blog view count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment view count for a post
app.post('/api/portfolio/blog/:postId/views', async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      `INSERT INTO blog_views (post_id, view_count) VALUES ($1, 1)
       ON CONFLICT (post_id) 
       DO UPDATE SET view_count = blog_views.view_count + 1, updated_at = NOW()
       RETURNING view_count`,
      [postId]
    );
    const count = result.rows[0]?.view_count || 0;
    res.json({ postId, count });
  } catch (error) {
    console.error('Blog view increment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all blog view counts
app.get('/api/portfolio/blog/views', async (req, res) => {
  try {
    const result = await pool.query('SELECT post_id, view_count FROM blog_views');
    const views = {};
    result.rows.forEach(row => {
      views[row.post_id] = row.view_count;
    });
    res.json({ views });
  } catch (error) {
    console.error('Blog views error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve React app for all other routes (catchall)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio running on http://localhost:${PORT}`);
});
