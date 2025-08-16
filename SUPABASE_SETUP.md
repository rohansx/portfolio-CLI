# Supabase Setup Guide for Blog View Counter

This guide will help you set up Supabase to handle persistent blog view counts across all users.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (if you don't have one)
3. Click "New Project"
4. Choose your organization and enter:
   - **Project Name**: `portfolio-blog-counter` (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project"

## Step 2: Set up the Database Table

1. In your Supabase dashboard, go to the **SQL Editor**
2. Click "New Query"
3. Copy and paste this SQL code:

```sql
-- Create the blog_views table
CREATE TABLE blog_views (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(50) UNIQUE NOT NULL,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for your blog posts
INSERT INTO blog_views (post_id, view_count) VALUES 
('1', 42),
('2', 37),
('3', 15)
ON CONFLICT (post_id) DO NOTHING;

-- Create a function to safely increment view counts
CREATE OR REPLACE FUNCTION increment_view_count(post_id_param VARCHAR)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  -- Insert or update the view count
  INSERT INTO blog_views (post_id, view_count, updated_at)
  VALUES (post_id_param, 1, NOW())
  ON CONFLICT (post_id)
  DO UPDATE SET 
    view_count = blog_views.view_count + 1,
    updated_at = NOW()
  RETURNING view_count INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional but recommended)
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- Allow public read access to view counts
CREATE POLICY "Allow public read access" ON blog_views
FOR SELECT USING (true);

-- Allow public updates to view counts (you might want to restrict this)
CREATE POLICY "Allow public increment" ON blog_views
FOR UPDATE USING (true);

-- Allow public inserts for new blog posts
CREATE POLICY "Allow public insert" ON blog_views
FOR INSERT WITH CHECK (true);
```

4. Click "Run" to execute the SQL

## Step 3: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://xyzcompany.supabase.co`)
   - **Project API Key** → **anon public** key

## Step 4: Configure Your Environment Variables

1. In your project root, create a `.env` file (or rename `.env.example` to `.env`)
2. Add your Supabase credentials:

```env
REACT_APP_SUPABASE_URL=your_project_url_here
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm start
   ```

2. Navigate to your blog section
3. View different blog posts - you should see the view counts increment
4. Open multiple browser windows/tabs - all should show the same view counts
5. Check your Supabase dashboard → **Table Editor** → **blog_views** to see the data updating in real-time

## Step 6: Production Deployment

When deploying to Vercel, Netlify, or other platforms:

1. Add the environment variables to your deployment platform:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`

2. The blog counter will automatically work across all users globally!

## Adding New Blog Posts

When you add new blog posts, the system will automatically create entries in the database. However, if you want to pre-populate view counts:

```sql
INSERT INTO blog_views (post_id, view_count) VALUES ('4', 0);
```

## Security Notes

- The current setup allows public read/write access to view counts
- For production, you might want to implement rate limiting
- Consider using Supabase's built-in rate limiting features
- You can modify the RLS policies for stricter access control

## Troubleshooting

If the counter doesn't work:

1. Check browser console for errors
2. Verify environment variables are set correctly
3. Ensure the database table was created successfully
4. Check the Supabase dashboard for any authentication issues

The system includes fallback to localStorage if Supabase is unavailable, so your blog will still function even if there are configuration issues.