const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3500;

// SQLite connection
const db = new Database(path.join(__dirname, 'data.db'));
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_views (
    post_id TEXT UNIQUE,
    view_count INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS portfolio_stats (
    stat_key TEXT UNIQUE,
    stat_value INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  );
  INSERT OR IGNORE INTO portfolio_stats (stat_key, stat_value) VALUES ('total_visitors', 0);
`);

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
app.get('/api/portfolio/visitors', (req, res) => {
  try {
    const row = db.prepare("SELECT stat_value FROM portfolio_stats WHERE stat_key = 'total_visitors'").get();
    const count = row?.stat_value || 0;
    res.json({ count });
  } catch (error) {
    console.error('Visitor count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment visitor count
app.post('/api/portfolio/visitors', (req, res) => {
  try {
    const row = db.prepare(
      `UPDATE portfolio_stats
       SET stat_value = stat_value + 1, updated_at = datetime('now')
       WHERE stat_key = 'total_visitors'
       RETURNING stat_value`
    ).get();
    const count = row?.stat_value || 0;
    res.json({ count });
  } catch (error) {
    console.error('Visitor increment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get view count for a post
app.get('/api/portfolio/blog/:postId/views', (req, res) => {
  const { postId } = req.params;
  try {
    const row = db.prepare('SELECT view_count FROM blog_views WHERE post_id = ?').get(postId);
    const count = row?.view_count || 0;
    res.json({ postId, count });
  } catch (error) {
    console.error('Blog view count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Increment view count for a post
app.post('/api/portfolio/blog/:postId/views', (req, res) => {
  const { postId } = req.params;
  try {
    const row = db.prepare(
      `INSERT INTO blog_views (post_id, view_count) VALUES (?, 1)
       ON CONFLICT (post_id)
       DO UPDATE SET view_count = blog_views.view_count + 1, updated_at = datetime('now')
       RETURNING view_count`
    ).get(postId);
    const count = row?.view_count || 0;
    res.json({ postId, count });
  } catch (error) {
    console.error('Blog view increment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all blog view counts
app.get('/api/portfolio/blog/views', (req, res) => {
  try {
    const rows = db.prepare('SELECT post_id, view_count FROM blog_views').all();
    const views = {};
    rows.forEach(row => {
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
